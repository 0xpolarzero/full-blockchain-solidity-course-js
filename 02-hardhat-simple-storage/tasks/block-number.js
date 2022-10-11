const { task } = require('hardhat/config');

task('block-number', 'Prints the number of the latest block').setAction(
  async (taskArguments, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log('Current block: ', blockNumber);
  },
);
