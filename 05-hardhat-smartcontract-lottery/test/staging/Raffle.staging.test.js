const { assert, expect } = require('chai');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');
const { getNamedAccounts, deployments, network, ethers } = require('hardhat');

developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle staging tests', function() {
      let deployer;
      let raffle;
      let raffleEntranceFee;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract('Raffle', deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe('fulfillRandomWords', function() {
        it('Works with live Chainlink Keepers and Chainlink VRF, we get a random winner', async () => {
          const startingTimeStamp = await raffle.getLastTimeStamp();
          const accounts = await ethers.getSigners();

          // * Setup a listener before entering the raffle
          await new Promise(async (resolve, reject) => {
            raffle.once('WinnerPicked', async () => {
              console.log('WinnerPicked event emitted');

              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLastTimeStamp();

                await expect(raffle.getParticipant(0)).to.be.reverted;
                assert(recentWinner.toString() === accounts[0].address);
                assert(raffleState === 0);
                assert(
                  winnerEndingBalance.toString() ===
                    winnerStartingBalance.add(raffleEntranceFee).toString(),
                );
                assert(endingTimeStamp > startingTimeStamp);

                resolve();
              } catch (err) {
                console.log(err);
                reject(err);
              }
            });

            // * Enter the raffle
            const tx = await raffle.enterRaffle({ value: raffleEntranceFee });
            await tx.wait(1);
            const winnerStartingBalance = await accounts[0].getBalance();
          });
        });
      });
    });
