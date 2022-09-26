require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
    },
  },
};
