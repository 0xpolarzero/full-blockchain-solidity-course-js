// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract SafeMathTester {
    // Before 0.8.0, this will overflow and get reset to 0 if you add 1
    uint8 public bigNumber = 255;

    function add() public {
        // If you're SURE it won't ever overflow ->
        // This is a bit more gas efficient
        unchecked {bigNumber = bigNumber + 1}
    }
}