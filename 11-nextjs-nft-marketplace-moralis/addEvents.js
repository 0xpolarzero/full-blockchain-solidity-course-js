const Moralis = require('moralis-v1/node');
require('dotenv').config();
const contractAddresses = require('./constants/networkMapping.json');

let chainId = process.env.chainId || 31337;
let moralisChainId = chainId === '31337' ? '1337' : chainId;
const contractAddressArray = contractAddresses[chainId]['NftMarketplace'];
const contractAddress = contractAddressArray[contractAddressArray.length - 1];

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_APP_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.moralisMasterKey;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`Moralis server started with ${contractAddress}`);

  let itemListedOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemListed(address, address, uint256, uint256)',
    abi: ITEM_LISTED_ABI,
    tableName: 'ItemListed',
  };

  let itemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemBought(address, address, uint256, uint256)',
    abi: ITEM_BOUGHT_ABI,
    tableName: 'ItemBought',
  };

  let itemCanceledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemCanceled(address, address, uint256)',
    abi: ITEM_CANCELED_ABI,
    tableName: 'ItemCanceled',
  };

  const itemListedResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemListedOptions,
    {
      useMasterKey: true,
    },
  );
  const itemBoughtResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemBoughtOptions,
    {
      useMasterKey: true,
    },
  );
  const itemCanceledResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemCanceledOptions,
    {
      useMasterKey: true,
    },
  );

  if (
    itemListedResponse.success &&
    itemBoughtResponse.success &&
    itemCanceledResponse.success
  ) {
    console.log('ItemListed event watcher started, database updated.');
  } else {
    console.log('Starting event watcher failed.');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const ITEM_LISTED_ABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'address',
      name: 'seller',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'address',
      name: 'nftAddress',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256',
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'price',
      type: 'uint256',
    },
  ],
  name: 'ItemListed',
  type: 'event',
};

const ITEM_BOUGHT_ABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'address',
      name: 'buyer',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'address',
      name: 'nftAddress',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256',
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'price',
      type: 'uint256',
    },
  ],
  name: 'ItemBought',
  type: 'event',
};

const ITEM_CANCELED_ABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'address',
      name: 'seller',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'address',
      name: 'nftAddress',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256',
    },
  ],
  name: 'ItemCanceled',
  type: 'event',
};
