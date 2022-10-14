const { getNamedAccounts, deployments, network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const boxV2 = await deploy('BoxV2', {
    from: deployer,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
    log: true,
    proxy: {
      // The proxy contract is owned by an admin contract
      proxyContract: 'OpenZeppelinTransparentProxy',
      viaAdminContract: {
        name: 'BoxProxyAdmin',
        artifact: 'BoxProxyAdmin',
      },
    },
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log('Verifying contract...');
    await verify(boxV2.address, []);
  }
};
