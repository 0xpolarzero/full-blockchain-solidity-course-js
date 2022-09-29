const { assert, expect } = require('chai');
const { developmentChains } = require('../../helper-hardhat-config');
const { getNamedAccounts, deployments, network, ethers } = require('hardhat');

const TOKEN_NAME = 'Dogie';
const TOKEN_SYMBOL = 'DOG';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('BasicNft unit tests', function() {
      let deployer;
      let user;
      let basicNft;

      beforeEach(async function() {
        deployer = (await getNamedAccounts()).deployer;
        user = (await ethers.getSigners())[1].address;
        await deployments.fixture('basic-nft');
        basicNft = await ethers.getContract('BasicNft', deployer);
      });

      describe('constructor', function() {
        it('Should initialize the contract with a tokenCounter at 0', async () => {
          const tokenCounter = await basicNft.getTokenCounter();
          assert(tokenCounter.toString() === '0');
        });

        it('Should initialize the contract with the right name and symbol', async () => {
          const name = await basicNft.name();
          const symbol = await basicNft.symbol();
          assert(name === TOKEN_NAME);
          assert(symbol === TOKEN_SYMBOL);
        });
      });

      describe('mint', function() {
        it('Should increment the counter when a token is minted', async () => {
          const tx = await basicNft.mintNft();
          await tx.wait(1);
          const tokenCounter = await basicNft.getTokenCounter();

          assert(tokenCounter.toString() === '1');
        });

        it('Should return the right URI when a token is minted', async () => {
          const tx = await basicNft.mintNft();
          await tx.wait(1);
          const NFTTokenURI = await basicNft.tokenURI(0);
          const contractTokenURI = await basicNft.TOKEN_URI();

          assert(NFTTokenURI === contractTokenURI);
        });
      });
    });
