const networkConfig = {
  31337: {
    name: 'localhost',
  },
  5: {
    name: 'goerli',
  },
  80001: {
    name: 'mumbai',
  },
};

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
  networkConfig,
  developmentChains,
};
