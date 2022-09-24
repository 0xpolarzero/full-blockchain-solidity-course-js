import { task } from 'hardhat/config';

export default task(
  'block-number',
  'Prints the number of the latest block',
).setAction(async (taskArguments, hre) => {
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log('Current block: ', blockNumber);
});
