const { ethers } = require('hardhat');
const { networks } = require('../hardhat.config');

async function readFromStorage() {
  const contractAddress = '0xB29eA9ad260B6DC980513bbA29051570b2115110';
  const storageSlotNumber = 777;

  // Connect to arbitrum
  const provider = new ethers.providers.JsonRpcProvider(networks.arbitrum.url);
  const valueAtStorage = await provider.getStorageAt(
    contractAddress,
    storageSlotNumber,
  );

  // If the value is a number
  const decodedValue = Number(content);
  console.log(decodedValue);
}

readFromStorage();
