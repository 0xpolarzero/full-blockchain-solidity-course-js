import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
  networkConfig,
  developmentChains,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} from '../helper-hardhat-config';
import verify from '../helper-functions';

const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await get('GovernanceToken');
  const timeLock = await get('TimeLock');

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];

  log('Deploying GovernorContract...');
  const governorContract = await deploy('GovernorContract', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log('GovernorContract deployed to:', governorContract.address);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governorContract.address, args);
  }
};

deployGovernorContract.tags = ['all', 'main', 'GovernorContract'];

export default deployGovernorContract;
