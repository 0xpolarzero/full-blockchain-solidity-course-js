const { ethers } = require('hardhat');
const { networks } = require('../hardhat.config');

const CONTRACT_ADDRESS = '0xB29eA9ad260B6DC980513bbA29051570b2115110';
const STORAGE_SLOT_NUMBER = 777;

async function readFromStorage() {
  // Connect to arbitrum
  const provider = new ethers.providers.JsonRpcProvider(networks.arbitrum.url);
  const valueAtStorage = await provider.getStorageAt(
    CONTRACT_ADDRESS,
    STORAGE_SLOT_NUMBER,
  );

  // If the value is a number
  const decodedValue = Number(content);
  console.log(decodedValue);
}

readFromStorage();
