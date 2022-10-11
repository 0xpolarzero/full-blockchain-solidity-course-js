const { ethers } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 1;
const NEW_PRICE = ethers.utils.parseEther('2');

async function updateListing() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  console.log('Updating listing on marketplace...');
  const listingTx = await nftMarketplace.updateListing(
    basicNft.address,
    TOKEN_ID,
    NEW_PRICE,
  );
  await listingTx.wait(1);
  console.log('Listing updated on marketplace!');

  if (network.config.chainId.toString() === '31337') {
    await moveBlocks(1, (sleepAmount = 1000));
  }
}

updateListing()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
