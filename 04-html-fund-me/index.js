import { ethers } from './vendor/ethers-5.2.esm.min.js';
import { contractAddress, abi } from './constants.js';

const connectBtn = document.querySelector('#connect');
connectBtn.addEventListener('click', connect);
const fundBtn = document.querySelector('#fund');
fundBtn.addEventListener('click', fund);
const balanceBtn = document.querySelector('#balance');
balanceBtn.addEventListener('click', getBalance);
const withdrawBtn = document.querySelector('#withdraw');
withdrawBtn.addEventListener('click', withdraw);

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error);
    }
    connectBtn.textContent = 'Connected';
    const accounts = await ethereum.request({ method: 'eth_accounts' });
  } else {
    connectBtn.textContent = 'Please install MetaMask';
  }
}

async function fund() {
  const ethAmount = document.querySelector('#fund-amount').value;
  console.log(`Funding ${ethAmount} ETH...`);

  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      await listenForTransactionMined(transactionResponse, provider);
      console.log('Done');
    } catch (err) {
      console.log(err);
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(`Contract balance: ${ethers.utils.formatEther(balance)} ETH`);
    } catch (err) {
      console.log(err);
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('Withdrawing...');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMined(transactionResponse, provider);
      console.log('Done');
    } catch (err) {
      console.log(err);
    }
  }
}

function listenForTransactionMined(transactionResponse, provider) {
  console.log(`Mining transaction ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    // reject needs to be handled as well
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Transaction mined with ${transactionReceipt.confirmations} confirmations.`,
      );
      resolve();
    });
  });
}
