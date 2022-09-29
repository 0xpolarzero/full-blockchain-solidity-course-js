const { assert, expect } = require('chai');
const {
  developmentChains,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  INITIAL_SUPPLY,
} = require('../../helper-hardhat-config');
const { getNamedAccounts, deployments, network, ethers } = require('hardhat');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OurToken unit tests', function() {
      let deployer;
      let otherAccount;
      let ourToken;

      beforeEach(async function() {
        deployer = (await getNamedAccounts()).deployer;
        otherAccount = (await ethers.getSigners())[1].address;
        await deployments.fixture('all');
        ourToken = await ethers.getContract('OurToken', deployer);
      });

      describe('constructor', function() {
        it('Should initialize the specified supply for the token', async () => {
          const deployedSupply = await ourToken.totalSupply();
          assert(INITIAL_SUPPLY.toString() === deployedSupply.toString());
        });

        it('Should assign the specified name for the token', async () => {
          const deployedName = await ourToken.name();
          assert(TOKEN_NAME === deployedName);
        });

        it('Should assign the specified symbol for the token', async () => {
          const deployedSymbol = await ourToken.symbol();
          assert(TOKEN_SYMBOL === deployedSymbol);
        });
      });

      describe('balanceOf', function() {
        it('Should return the correct balance for the specified address', async () => {
          const balance = await ourToken.balanceOf(deployer);
          assert(INITIAL_SUPPLY.toString() === balance.toString());
        });
      });

      describe('transfer', function() {
        it('Should transfer the specified amount from an address to another', async () => {
          const amount = '10000';
          const sender = deployer;
          const senderBalanceBefore = await ourToken.balanceOf(sender);
          const receiverBalanceBefore = await ourToken.balanceOf(otherAccount);

          const tx = await ourToken.transfer(otherAccount, amount);
          const txReceipt = await tx.wait(1);

          const senderBalanceAfter = await ourToken.balanceOf(sender);
          const receiverBalanceAfter = await ourToken.balanceOf(otherAccount);

          assert(
            senderBalanceBefore.sub(amount).toString() ===
              senderBalanceAfter.toString(),
          );
          assert(
            receiverBalanceBefore.add(amount).toString() ===
              receiverBalanceAfter.toString(),
          );
        });
      });

      describe('allowance', function() {
        it('Should return the correct allowance for the specified address after being approved', async () => {
          const amount = '10000';
          await ourToken.approve(otherAccount, amount);
          const allowance = await ourToken.allowance(deployer, otherAccount);

          assert(amount === allowance.toString());
        });
      });

      describe('transferFrom', function() {
        it('Should transfer the specified amount from an address to another after being approved', async () => {
          const amount = '10000';
          const senderBalanceBefore = await ourToken.balanceOf(deployer);
          const receiverBalanceBefore = await ourToken.balanceOf(otherAccount);

          await ourToken.approve(deployer, amount);
          await ourToken.connect(otherAccount);
          const tx = await ourToken.transferFrom(
            deployer,
            otherAccount,
            amount,
          );
          const txReceipt = await tx.wait(1);

          const senderBalanceAfter = await ourToken.balanceOf(deployer);
          const receiverBalanceAfter = await ourToken.balanceOf(otherAccount);

          assert(
            senderBalanceBefore.sub(amount).toString() ===
              senderBalanceAfter.toString(),
          );
          assert(
            receiverBalanceBefore.add(amount).toString() ===
              receiverBalanceAfter.toString(),
          );
        });

        it('Should not allow a transfer if the address has not been approved', async () => {
          const amount = '10000';
          const tx = ourToken.transferFrom(deployer, otherAccount, amount);

          await expect(tx).to.be.revertedWith('ERC20: insufficient allowance');
        });
      });

      describe('increaseAllowance', function() {
        it('Should increase an address allowance amount when called', async () => {
          const amount = '10000';
          const additionalAmount = '5000';
          await ourToken.approve(otherAccount, amount);
          const initialAmountAllowed = await ourToken.allowance(
            deployer,
            otherAccount,
          );

          await ourToken.increaseAllowance(otherAccount, additionalAmount);
          const newAmountAllowed = await ourToken.allowance(
            deployer,
            otherAccount,
          );

          assert(
            newAmountAllowed.toString() ===
              (
                Number(initialAmountAllowed) + Number(additionalAmount)
              ).toString(),
          );
        });
      });

      describe('decreaseAllowance', function() {
        it('Should decrease an address allowance amount when called', async () => {
          const amount = '10000';
          const substractedAmount = '5000';
          await ourToken.approve(otherAccount, amount);
          const initialAmountAllowed = await ourToken.allowance(
            deployer,
            otherAccount,
          );

          await ourToken.decreaseAllowance(otherAccount, substractedAmount);
          const newAmountAllowed = await ourToken.allowance(
            deployer,
            otherAccount,
          );

          assert(
            newAmountAllowed.toString() ===
              (
                Number(initialAmountAllowed) - Number(substractedAmount)
              ).toString(),
          );
        });
      });
    });
