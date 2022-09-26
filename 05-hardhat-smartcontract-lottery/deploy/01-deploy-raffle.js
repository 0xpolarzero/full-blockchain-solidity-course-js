const { network } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

const VRF_SUB_FUND_AMOUNT = '1000000000000000000000';

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address;
  let subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock',
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionsResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionsResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;
    // The subscription needs to be funded
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT,
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordinatorV2'];
    subscriptionId = networkConfig[chainId]['subscriptionId'];
  }

  const entranceFee = networkConfig[chainId]['raffleEntranceFee'];
  const gasLane = networkConfig[chainId]['gasLane'];
  const callbackGasLimit = networkConfig[chainId]['callbackGasLimit'];
  const keepersUpdateInterval = networkConfig[chainId]['keepersUpdateInterval'];
  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    keepersUpdateInterval,
  ];

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log('Verifying contract...');
    await verify(raffle.address, args);
  }
};

module.exports.tags = ['all', 'raffle'];
