const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');
const { developmentChains } = require('../helper-hardhat-config');

// So it only works in development
!developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async function () {
      let fundMe;
      let deployer;
      let account;

      beforeEach(async function () {
        // Deploy the contract
        account = await ethers.getSigners();
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);
        // We connect the contract to the deployer, so each time it's called, it's from the deployer
        fundMe = await ethers.getContract('FundMe', deployer);
        mockV3Aggregator = await ethers.getContract(
          'MockV3Aggregator',
          deployer,
        );
      });

      describe('constructor', async function () {
        it('Sets the aggregator address correctly', async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe('fund', async function () {
        it('Fails if the Eth amount sent is too low', async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            `Didn't send enough Eth!`,
          );
        });

        it('Updated the amount funded data structure', async function () {
          await fundMe.fund({
            value: ethers.utils.parseEther('1'),
          });
          const response = await fundMe.getAddressToAmountFunded(deployer);

          assert.equal(response.toString(), ethers.utils.parseEther('1'));
        });

        it('Adds funder to the array of funders', async function () {
          await fundMe.fund({
            value: ethers.utils.parseEther('1'),
          });
          const funder = await fundMe.getFunder(0);
          assert.equal(funder, deployer);
        });
      });

      describe('withdraw', async function () {
        beforeEach(async function () {
          await fundMe.fund({
            value: ethers.utils.parseEther('1'),
          });
        });

        it('Withdraw Eth from a single funder', async function () {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address,
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer,
          );

          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // We use .mul to work with big numbers
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address,
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer,
          );

          assert.equal(endingFundMeBalance.toString(), '0');
          assert.equal(
            // We use .add to work with big numbers
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString(),
          );
        });
      });

      it('Withdraw Eth with multiple funder', async function () {
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
          // We need to connect the contract to the account, so it's not from the deployer anymore
          const fundMeConnectedContract = await fundMe.connect(accounts[i]);
          await fundMeConnectedContract.fund({
            value: ethers.utils.parseEther('1'),
          });

          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address,
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer,
          );

          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // We use .mul to work with big numbers
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address,
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer,
          );

          assert.equal(endingFundMeBalance.toString(), '0');
          assert.equal(
            // We use .add to work with big numbers
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString(),
          );

          // Make sure that the funders array is reset
          await expect(fundMe.getFunder(0)).to.be.reverted;

          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0,
            );
          }
        }
      });

      it('Only allows the owner to withdraw', async function () {
        const accounts = await ethers.getSigners();
        const attacker = accounts[1];
        const attackerConnectedContract = await fundMe.connect(attacker);

        await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
          'FundMe__NotOwner',
        );
      });

      it('Cheaper withdraw testing', async function () {
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
          // We need to connect the contract to the account, so it's not from the deployer anymore
          const fundMeConnectedContract = await fundMe.connect(accounts[i]);
          await fundMeConnectedContract.fund({
            value: ethers.utils.parseEther('1'),
          });

          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address,
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer,
          );

          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // We use .mul to work with big numbers
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address,
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer,
          );

          assert.equal(endingFundMeBalance.toString(), '0');
          assert.equal(
            // We use .add to work with big numbers
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString(),
          );

          // Make sure that the funders array is reset
          await expect(fundMe.getFunder(0)).to.be.reverted;

          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0,
            );
          }
        }
      });
    });
