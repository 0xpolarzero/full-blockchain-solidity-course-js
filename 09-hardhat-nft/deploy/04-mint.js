const { network, ethers } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //   BasicNft
  const basicNft = await ethers.getContract('BasicNft', deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
  console.log(`BasicNft index 0 tokenURI: ${await basicNft.tokenURI(0)}`);

  // RandomIpfsNft
  const randomIpfsNft = await ethers.getContract('RandomIpfsNft', deployer);
  const mintFee = await randomIpfsNft.getMintFee();
  const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
    value: mintFee.toString(),
  });
  const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

  await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("'NftMinted' event did not fire"), 300000);
    randomIpfsNft.once('NftMinted', async () => {
      resolve();
    });
  });

  if (developmentChains.includes(network.name)) {
    const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFConsumerV2Mock',
      deployer,
    );
    await vrfCoordinatorV2Mock.fulfillRandomWords(
      requestId,
      randomIpfsNft.address,
    );
  }
  console.log(
    `RandomIpfsNft index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`,
  );

  // DynamicSvgNft
  const highValue = ethers.utils.parseEther('2000');
  const dynamicSvgNft = await ethers.getContract('DynamicSvgNft', deployer);
  const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString());
  await dynamicSvgNftMintTx.wait(1);
  console.log(
    `DynamicSvgNft index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`,
  );
};

module.exports.tags = ['all', 'mint'];
