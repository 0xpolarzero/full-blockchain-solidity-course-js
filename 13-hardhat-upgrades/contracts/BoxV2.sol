// SPDX-License-Identifier: MIT
// Implementation logic

pragma solidity ^0.8.8;

contract BoxV2 {
    uint256 internal value;

    event ValueChanged(uint256 newValue);

    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function retrieve() public view returns (uint256) {
        return value;
    }

    function increment() public {
        value = value + 1;
        emit ValueChanged(value);
    }

    function version() public pure returns (uint256) {
        return 2;
    }
}
