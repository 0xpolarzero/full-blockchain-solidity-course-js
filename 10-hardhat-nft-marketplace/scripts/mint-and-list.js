const { ethers } = require('hardhat');

const PRICE = ethers.utils.parseEther('1');

async function mintAndList() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  console.log('Minting a NFT...');
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId;

  console.log('Approving the marketplace to spend the NFT...');
  const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approvalTx.wait(1);

  console.log('Listing NFT on marketplace...');
  const listingTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    PRICE,
  );
  await listingTx.wait(1);
  console.log('NFT listed on marketplace!');
}

mintAndList()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
