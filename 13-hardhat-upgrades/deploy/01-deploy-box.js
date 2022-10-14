const { network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const box = await deploy('Box', {
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
    await verify(box.address, []);
  }
};
