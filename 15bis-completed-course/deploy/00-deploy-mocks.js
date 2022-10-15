const { network } = require('hardhat');

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const vulnerableContract = await deploy('VulnerableContract', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const courseCompletedNFT = await deploy('CourseCompletedNFT', {
    from: deployer,
    args: [vulnerableContract.address],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ['all', 'course-completed', 'mocks'];
