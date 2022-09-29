const { network, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
  FUND_AMOUNT,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const {
  storeImages,
  storeTokenUriMetadata,
} = require('../utils/uploadToPinata');

const imagesLocation = './images/random';
const metadataTemplate = {
  name: '',
  description: '',
  image: '',
  attributes: [
    {
      trait_type: 'Tiredness',
      value: '100',
    },
  ],
};

let tokenUris = [
  'ipfs://QmaYUzv1Mm4tGwmtdw6ajv1945dnCYMdBAoB5RBdbuVHKL',
  'ipfs://QmYpo4hMJu3X86Lm7FTAga4qm3Xw78YNAKUUuWJBRBudjq',
  'ipfs://Qmb6pdMJcbndnLbejYdD4Bi2UQdfsXkio6wwYjZTowz67h',
];

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let vrfCoordinatorV2Mock;
  let vrfCoordinatorV2Address;
  let subscriptionId;

  if (process.env.UPLOAD_TO_PINATA == 'true') {
    tokenUris = await handleTokenUris();
  }

  if (developmentChains.includes(network.name)) {
    vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2Address;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];

  const randomIpfsNft = await deploy('RandomIpfsNft', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  developmentChains.includes(network.name) &&
    (await vrfCoordinatorV2Mock.addConsumer(
      Number(subscriptionId),
      randomIpfsNft.address,
    ));

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log('Verifying contract...');
    await verify(randomIpfsNft.address, args);
  }
};

async function handleTokenUris() {
  tokenUris = [];
  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocation,
  );

  for (const imageUploadResponsesIndex in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[imageUploadResponsesIndex].replace(
      '.png',
      '',
    );
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name}!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`;

    console.log(`Uploading metadata for ${tokenUriMetadata.name}...`);
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata,
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log('Done uploading metadata: ');
  console.log(tokenUris);

  return tokenUris;
}

module.exports.tags = ['all', 'random-ipfs-nft'];
