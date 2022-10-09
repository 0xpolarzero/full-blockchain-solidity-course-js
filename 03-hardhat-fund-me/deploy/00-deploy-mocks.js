// We won't need this mock for mainnet, goerli... but for local development
// We will need to deploy a mock for the price feed

const { network } = require('hardhat');
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require('../helper-hardhat-config');

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log('Local development : deploying MockV3Aggregator...');
    const MockV3Aggregator = await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log('MockV3Aggregator deployed to:', MockV3Aggregator.address);
    log('------------------------------------------------------------');
  }
};

module.exports.tags = ['all', 'mocks'];
