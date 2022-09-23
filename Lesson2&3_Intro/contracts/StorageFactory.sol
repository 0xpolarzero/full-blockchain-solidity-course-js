// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory {
    // This would replace the var each time a contract is created
    // SimpleStorage public simpleStorage;
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber)
        public
    {
        // To refer to a contract, we need its ADDRESS and ABI

        // SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        // simpleStorage.store(_simpleStorageNumber);
        // Even quicker
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) public view returns (uint256) {
        // SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        // return simpleStorage.retrieve();
        // Even quicker
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}
