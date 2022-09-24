const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('SimpleStorage', function () {
  let simpleStorageFactory;
  let simpleStorage;

  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it('Should start with a favorite number of 0', async function () {
    const favoriteNumber = await simpleStorage.retrieve();
    const expectedNumber = '0';
    assert.equal(favoriteNumber.toString(), expectedNumber);
  });

  it('Should update the number when we call store', async function () {
    const expectedNumber = '42';
    const transactionResponse = await simpleStorage.store(expectedNumber);
    await transactionResponse.wait(1);

    const favoriteNumber = await simpleStorage.retrieve();
    assert.equal(favoriteNumber.toString(), expectedNumber);
  });

  it('Should add a person with their favorite number', async function () {
    const expectedNumber = '13';
    const expectedName = 'John';
    const transactionResponse = await simpleStorage.addPerson(
      expectedName,
      expectedNumber,
    );
    await transactionResponse.wait(1);

    const johnFavoriteNumber = await simpleStorage.nameToFavoriteNumber(
      expectedName,
    );
    assert.equal(johnFavoriteNumber, expectedNumber);
  });
});
