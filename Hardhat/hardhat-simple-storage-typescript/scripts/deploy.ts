import { ethers, run, network } from 'hardhat';

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
  console.log('Deploying contract...');
  const simpleStorage = await SimpleStorageFactory.deploy();

  await simpleStorage.deployed();
  console.log('Deployed to:', simpleStorage.address);

  // Only verify if we're on Goerli (so not in local) & if we have an API key
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    // Wait for a few blocks to make sure Etherscan know about this contract
    console.log('Waiting for a few blocks...');
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentFavoriteNumber = await simpleStorage.retrieve();
  console.log('Current favorite number:', currentFavoriteNumber.toString());

  const transactionResponse = await simpleStorage.store(42);
  await transactionResponse.wait(1);
  const updatedFavoriteNumber = await simpleStorage.retrieve();
  console.log('Updated favorite number:', updatedFavoriteNumber.toString());
}

async function verify(contractAddress: string, args: any[]) {
  console.log('Verifying contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err: any) {
    if (err.mess.toLowerCase().includes('already verified')) {
      console.log('Contract already verified');
    } else {
      console.log(err);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1);
  });

// yarn hardhat run scripts/deploy.js --network goerli

// To deploy a local environment like Ganache
// yarn hardhat node

// To ge to the hardhat console
// yarn hardhat console --network goerli
// There it's possible to run any command/line from the deploy.js file for instance

// To clean artifacts and compile again
// yarn hardhat clean

// If hh config file, gasReporter can be enabled/disabled

// solidity-coverage go through all the .sol files, and say it if some line...
// ... doesn't have a test
// yarn hardhat coverage
