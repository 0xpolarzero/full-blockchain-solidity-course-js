import { ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { networkConfig, developmentChains } from '../helper-hardhat-config';
import verify from '../helper-functions';

const deployGovernanceToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('Deploying GovernanceToken...');
  const governanceToken = await deploy('GovernanceToken', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log('GovernanceToken deployed to:', governanceToken.address);

  await delegate(governanceToken.address, deployer);
  log('Delegated governance token to deployer');

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governanceToken.address, []);
  }
};

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string,
) => {
  const governanceToken = await ethers.getContractAt(
    'GovernanceToken',
    governanceTokenAddress,
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(`Delegated ${governanceTokenAddress} to ${delegatedAccount}`);
  console.log(
    `Checkpoints length: ${await governanceToken.numCheckpoints(
      delegatedAccount,
    )}`,
  );
};

deployGovernanceToken.tags = ['all', 'main', 'GovernanceToken'];

export default deployGovernanceToken;
