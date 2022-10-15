const { assert, expect } = require('chai');
const { deployments, network, ethers } = require('hardhat');
const keccak256 = require('keccak256');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('CourseCompleted unit tests', function() {
      const SELECTOR = ethers.utils
        .hexlify(keccak256('dontDoSomething()'))
        .slice(0, 10);
      let deployer;
      let courseCompletedNFT;
      let grabNFT;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture('all');
        courseCompletedNFT = await ethers.getContract('CourseCompletedNFT');
        grabNFT = await ethers.getContract('GrabNFT');
      });

      describe('mintNft', function() {
        it('Should mint a NFT', async () => {
          const tx = await courseCompletedNFT.mintNft(
            grabNFT.address,
            SELECTOR,
          );
          await tx.wait(1);
          const balance = await courseCompletedNFT.balanceOf(deployer.address);

          assert(balance.eq(1));
          console.log(SELECTOR);
        });
      });
    });
