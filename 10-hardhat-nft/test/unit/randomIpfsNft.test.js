const { assert, expect } = require('chai');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');
const { getNamedAccounts, deployments, network, ethers } = require('hardhat');

const TOKEN_NAME = 'RandomIpfsNft';
const TOKEN_SYMBOL = 'RIN';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('RandomIpfsNft unit tests', function() {
      let deployer;
      let user;
      let randomIpfsNft;
      let vrfCoordinatorV2Mock;
      let mintFee;
      const chainId = network.config.chainId;
      const MINT_FEE = networkConfig[chainId].mintFee;

      beforeEach(async function() {
        deployer = (await getNamedAccounts()).deployer;
        user = (await ethers.getSigners())[1];
        await deployments.fixture('random-ipfs-nft');
        randomIpfsNft = await ethers.getContract('RandomIpfsNft', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer,
        );
        mintFee = await randomIpfsNft.getMintFee();
      });

      describe('constructor', function() {
        it('Should initialize the contract with a tokenCounter at 0', async () => {
          const tokenCounter = await randomIpfsNft.getTokenCounter();
          assert(tokenCounter.toString() === '0');
        });

        it('Should initialize the contract with the right name and symbol', async () => {
          const name = await randomIpfsNft.name();
          const symbol = await randomIpfsNft.symbol();
          assert(name === TOKEN_NAME);
          assert(symbol === TOKEN_SYMBOL);
        });
      });

      describe('requestNft', function() {
        it('Emits an event when the function is called', async () => {
          await expect(randomIpfsNft.requestNft({ value: mintFee })).to.emit(
            randomIpfsNft,
            'NftRequested',
          );
        });

        it('Reverts if the fee is not enough', async () => {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            'RandomIpfsNft__NotEnoughETHToMint',
          );

          await expect(
            randomIpfsNft.requestNft({
              value: mintFee.sub(ethers.utils.parseEther('0.005').toString()),
            }),
          ).to.be.revertedWith('RandomIpfsNft__NotEnoughETHToMint');
        });
      });

      describe('fulfillRandomWords', function() {
        it('Mints a NFT after a random number is returned', async () => {
          await new Promise(async (resolve, reject) => {
            randomIpfsNft.once('NftMinted', async () => {
              try {
                const tokenCounter = await randomIpfsNft.getTokenCounter();
                const tokenUri = await randomIpfsNft.tokenURI('0');
                assert(tokenCounter.toString() === '1');
                assert(tokenUri.toString().includes('ipfs://') === true);
                resolve();
              } catch (err) {
                console.log(err);
                reject(err);
              }
            });

            try {
              const tx = await randomIpfsNft.requestNft({ value: mintFee });
              const txReceipt = await tx.wait(1);
              const requestId = txReceipt.events[1].args.requestId;

              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                randomIpfsNft.address,
              );
            } catch (err) {
              console.log(err);
              reject(err);
            }
          });
        });
      });

      describe('getBreedFromModdedRng', () => {
        it('should return pug if 0 < moddedRng < 10', async function() {
          const value = await randomIpfsNft.getBreedFromModdedRng(6);
          assert(value === 0);
        });
        it('should return shiba-inu if moddedRng is between 10 - 39', async function() {
          const value = await randomIpfsNft.getBreedFromModdedRng(25);
          assert(value === 1);
        });
        it('should return st. bernard if moddedRng is between 40 - 99', async function() {
          const value = await randomIpfsNft.getBreedFromModdedRng(90);
          assert(value === 2);
        });
        it('should revert if moddedRng > 99', async function() {
          await expect(
            randomIpfsNft.getBreedFromModdedRng(100),
          ).to.be.revertedWith('RandomIpfsNft__RangeOutOfBounds');
        });
      });

      describe('withdraw', function() {
        it('Should revert if the caller is not the deployer', async () => {
          await expect(
            randomIpfsNft.connect(user).withdraw(),
          ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('Should transfer the contract balance to the deployer', async () => {
          // Let a user mint a nft
          // Connect the user to the contract
          await randomIpfsNft.requestNft({ value: mintFee });
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployer,
          );
          const initialContractBalance = await ethers.provider.getBalance(
            randomIpfsNft.address,
          );

          const tx = await randomIpfsNft.withdraw();
          const txReceipt = await tx.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const finalDeployerBalance = await ethers.provider.getBalance(
            deployer,
          );
          const finalContractBalance = await ethers.provider.getBalance(
            randomIpfsNft.address,
          );

          assert(finalContractBalance.toString() === '0');
          assert(
            finalDeployerBalance.toString() ===
              initialDeployerBalance
                .add(initialContractBalance)
                .sub(gasCost)
                .toString(),
          );
        });
      });
    });
