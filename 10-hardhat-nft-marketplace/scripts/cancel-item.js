const { ethers, network } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 3;

async function cancelItem() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  console.log('Cancelling item...');
  const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
  await tx.wait(1);
  console.log('Item canceled!');

  if (network.config.chainId.toString() === '31337') {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

cancelItem()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
