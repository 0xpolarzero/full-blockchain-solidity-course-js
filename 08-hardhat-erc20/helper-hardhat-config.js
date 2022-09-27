const networkConfig = {
  default: {
    name: 'hardhat',
  },
  31337: {
    name: 'localhost',
  },
  5: {
    name: 'goerli',
  },
};

const TOKEN_NAME = 'OurToken';
const TOKEN_SYMBOL = 'OT';
const INITIAL_SUPPLY = '100000000000000000000000';
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
  networkConfig,
  developmentChains,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  INITIAL_SUPPLY,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
