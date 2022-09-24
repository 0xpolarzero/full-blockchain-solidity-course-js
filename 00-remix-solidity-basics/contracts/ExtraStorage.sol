// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

// This contract will inherit all the functionalities of SimpleStorage
contract ExtraStorage is SimpleStorage {
    // We can modify an existing function with "override"
    // But the original function needs the "virtual" keyword
    function store(uint256 _favoriteNumber) public override {
        favoriteNumber = _favoriteNumber + 5;
    }
}
