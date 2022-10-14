import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
  networkConfig,
  developmentChains,
  MIN_DELAY,
} from '../helper-hardhat-config';
import verify from '../helper-functions';

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [MIN_DELAY, [], []];

  log('Deploying TimeLock...');
  const timeLock = await deploy('TimeLock', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log('TimeLock deployed to:', timeLock.address);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(timeLock.address, args);
  }
};

deployTimeLock.tags = ['all', 'main', 'TimeLock'];

export default deployTimeLock;
