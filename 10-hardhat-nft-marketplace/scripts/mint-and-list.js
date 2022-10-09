const { ethers } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const PRICE = ethers.utils.parseEther('1');

async function mintAndList() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  console.log('Minting a NFT...');
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId;

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

  if (network.config.chainId.toString() === '31337') {
    await moveBlocks(1, (sleepAmount = 1000));
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
