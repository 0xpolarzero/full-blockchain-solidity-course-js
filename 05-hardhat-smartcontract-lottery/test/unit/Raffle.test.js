const { assert, expect } = require('chai');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');
const { getNamedAccounts, deployments, network, ethers } = require('hardhat');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle unit tests', function() {
      let deployer;
      let raffle;
      let raffleEntranceFee;
      let interval;
      let vrfCoordinatorV2Mock;
      const chainId = network.config.chainId;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture('all');
        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer,
        );
        raffleEntranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
      });

      describe('constructor', function() {
        it('Initializes the raffle correctly', async () => {
          const raffleState = await raffle.getRaffleState();

          assert(raffleState.toString() === '0');
          assert(
            interval.toString() ===
              networkConfig[chainId].keepersUpdateInterval,
          );
        });
      });

      describe('enterRaffle', async function() {
        it("Reverts if you don't pay enough", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            'Raffle__NotEnoughETHToEnter',
          );
        });

        it('Records participants when they enter', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const newParticipant = await raffle.getParticipant(0);
          assert(newParticipant === deployer);
        });

        it('Emits an event when a participant enters', async () => {
          await expect(raffle.enterRaffle({ value: raffleEntranceFee }))
            .to.emit(raffle, 'RaffleEntered')
            .withArgs(deployer);
        });

        it('Does not allow a participant to enter when the raffle is calculating', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });

          // We need to pretend that the performUpkeep function has been called
          // So first we can pass time to the next interval
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.send('evm_mine', []);

          // Then we can call the performUpkeep function as if we were the Chainlink keeper
          await raffle.performUpkeep([]);

          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee }),
          ).to.be.revertedWith('Raffle__RaffleClosed');
        });
      });

      describe('checkUpkeep', function() {
        it('Returns false if people have not sent any ETH', async () => {
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.send('evm_mine', []);
          // We need to get the return value of the function
          const { upkeepNeeded } = raffle.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it('Returns false if the raffle is closed', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.send('evm_mine', []);
          await raffle.performUpkeep([]);

          const raffleState = await raffle.getRaffleState();
          const { upkeepNeeded } = raffle.callStatic.checkUpkeep([]);
          assert.equal(raffleState.toString(), '1');
          assert(!upkeepNeeded);
        });

        it('Returns false if not enough time has passed', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            Number(interval) - 5,
          ]); // use a higher number here if this test fails
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x'); // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
          assert(!upkeepNeeded);
        });

        it('Returns true if enough time has passed, has players, eth, and is open', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x'); // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
          assert(upkeepNeeded);
        });
      });

      describe('performUpkeep', function() {
        it('It will only run if checkUpkeep is true', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.send('evm_mine', []);

          const tx = await raffle.performUpkeep([]);
          assert(tx);
        });

        it('Reverts if checkUpkeep is false', async () => {
          await expect(raffle.performUpkeep([])).to.be.revertedWith(
            'Raffle__UpkeepNotNeeded',
          );
        });

        it('Updates the raffle state, emits an event and calls the vrf coordinator', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.send('evm_mine', []);

          const txResponse = await raffle.performUpkeep([]);
          const txReceipt = await txResponse.wait(1);
          const requestId = txReceipt.events[1].args.requestId;
          const raffleState = await raffle.getRaffleState();

          assert(Number(requestId) > 0);
          assert(raffleState.toString() === '1');
        });
      });

      describe('fulfillRandomWords', function() {
        beforeEach(async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            Number(interval) + 1,
          ]);
          await network.provider.send('evm_mine', []);
          // await raffle.performUpkeep([]);
        });

        it('Can only be called after performUpkeep', async () => {
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address),
          ).to.be.revertedWith('nonexistent request');
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address),
          ).to.be.revertedWith('nonexistent request');
        });

        // A way to big test
        it('Picks a winner, resets the lottery & sends the prize', async () => {
          const additionalEntrants = 3;
          const startingIndex = 1;
          const accounts = await ethers.getSigners();

          for (
            let i = startingIndex;
            i < additionalEntrants + startingIndex;
            i++
          ) {
            raffle = raffle.connect(accounts[i]);
            await raffle.enterRaffle({ value: raffleEntranceFee });
          }

          const startingTimeStamp = await raffle.getLastTimeStamp();

          // * Setting up a listener for the winner picking
          await new Promise(async (resolve, reject) => {
            raffle.once('WinnerPicked', async () => {
              console.log('Event has been fired');
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const endingTimeStamp = await raffle.getLastTimeStamp();
                const participantCount = await raffle.getParticipantCount();
                const winnerEndingBalance = await accounts[1].getBalance();

                assert(participantCount.toString() === '0');
                assert(raffleState.toString() === '0');
                assert(endingTimeStamp > startingTimeStamp);

                assert(
                  winnerEndingBalance.toString() ===
                    winnerStartingBalance
                      .add(
                        raffleEntranceFee
                          .mul(additionalEntrants)
                          .add(raffleEntranceFee)
                          .toString(),
                      )
                      .toString(),
                );

                resolve();
                // We need to set up an interval at the end of which we consider the test failed
                // which is actually located in the hardhat.config.js file
              } catch (err) {
                reject(err);
                console.log(err);
              }
            });

            // * Simulating the winner picking as Chainlink Keeper/VRF
            const tx = await raffle.performUpkeep([]);
            const txReceipt = await tx.wait(1);
            const winnerStartingBalance = await accounts[1].getBalance();
            await vrfCoordinatorV2Mock.fulfillRandomWords(
              txReceipt.events[1].args.requestId,
              raffle.address,
            );
          });
        });
      });
    });
