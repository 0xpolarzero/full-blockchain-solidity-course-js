const fs = require('fs');
const { network, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await ethers.getContract('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const lowSvg = fs.readFileSync('./images/dynamic/frown.svg', 'utf8');
  const highSvg = fs.readFileSync('./images/dynamic/happy.svg', 'utf8');

  const args = [ethUsdPriceFeedAddress, lowSvg, highSvg];
  const dynamicSvgNft = await deploy('DynamicSvgNft', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log('Verifying contract...');
    await verify(dynamicSvgNft.address, args);
  }
};

module.exports.tags = ['all', 'dynamic-svg-nft', 'main'];
