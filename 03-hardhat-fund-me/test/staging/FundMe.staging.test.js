const { inputToConfig } = require('@ethereum-waffle/compiler');
const { getNamedAccounts, ethers, network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const { assert } = require('chai');

// So it only works on testnets
developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async function () {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther('1');

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract('FundMe', deployer);
      });

      it('Allows people to fund and withdraw', async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await ethers.provider.getBalance(fundMe.address);
      });

      assert.equal(endingBalance.toString(), '0');
    });
