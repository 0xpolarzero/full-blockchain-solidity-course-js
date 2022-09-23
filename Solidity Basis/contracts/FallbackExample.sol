// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract fallbackExample {
    uint256 public result;

    // This will get triggered anytime some Eth is sent to the contract
    // (except if there is some data (calldata) associated to the tx)
    receive() external payable {
        result = 1;
    }

    // But this special function is called anytime a tx is sent to the contract
    // (exen if there are some data)
    fallback() external payable {
        result = 2;
    }
}
