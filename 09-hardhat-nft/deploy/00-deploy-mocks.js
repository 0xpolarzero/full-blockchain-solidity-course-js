const { network } = require('hardhat');
const { DECIMALS, INITIAL_PRICE } = require('../helper-hardhat-config');

const BASE_FEE = '250000000000000000';
const GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    console.log('Local network detected! Deploying mocks...');
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });
    await deploy('MockV3Aggregator', {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });

    console.log('Mocks Deployed!');
  }
};
module.exports.tags = ['all', 'mocks', 'main'];
