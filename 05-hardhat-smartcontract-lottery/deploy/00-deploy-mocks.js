const { network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');

const BASE_FEE = ethers.utils.parseEther('0.25');
// Calculated value based on the gas price of the chain
const GAS_PRICE_LINK = 1e9;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    console.log('Local network, deploying mocks...');
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      args: [BASE_FEE, GAS_PRICE_LINK],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    console.log('Mocks deployed!');
  }
};

module.exports.tags = ['all', 'mocks'];
