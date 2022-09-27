const { network } = require('hardhat');
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const ourToken = await deploy('OurToken', {
    from: deployer,
    args: [INITIAL_SUPPLY],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
    console.log('Verifying contract...');
    await verify(ourToken.address, [INITIAL_SUPPLY]);
  }
};

module.exports.tags = ['all', 'OurToken'];
