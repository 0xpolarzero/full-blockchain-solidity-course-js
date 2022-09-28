const networkConfig = {
  31337: {
    name: 'localhost',
    wethToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    lendingPoolAddressesProvider: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    daiEthPriceFeed: '0x773616E4d11A78F511299002da57A0a94577F1f4',
    daiToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },

  5: {
    name: 'goerli',
    ethUsdPriceFeed: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    wethToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    lendingPoolAddressesProvider: '0x5E52dEc931FFb32f609681B8438A51c675cc232d',
    daiEthPriceFeed: '0xb4c4a493AB6356497713A78FFA6c60FB53517c63',
    daiToken: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
  },
};

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
  networkConfig,
  developmentChains,
};
