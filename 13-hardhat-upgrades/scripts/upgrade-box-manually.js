const { developmentChains } = require('../helper-hardhat-config');
const { network, deployments, getNamedAccounts } = require('hardhat');
const { verify } = require('../utils/verify');

async function main() {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : network.config.blockConfirmations;

  const boxV2 = await deploy('BoxV2', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...');
    await verify(boxV2.address, []);
  }

  // Upgrade!
  // Not "the hardhat-deploy way"
  const boxProxyAdmin = await ethers.getContract('BoxProxyAdmin');
  const transparentProxy = await ethers.getContract('Box_Proxy');
  const upgradeTx = await boxProxyAdmin.upgrade(
    transparentProxy.address,
    boxV2.address,
  );
  await upgradeTx.wait(1);

  const proxyBox = await ethers.getContractAt(
    'BoxV2',
    transparentProxy.address,
  );
  const version = await proxyBox.version();
  console.log('Version: ', version.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
