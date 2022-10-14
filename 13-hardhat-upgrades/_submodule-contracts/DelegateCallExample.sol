// SPDX-License-Identifier: MIT

// From https://solidity-by-example.org/delegatecall

pragma solidity ^0.8.7;

// NOTE: Deploy this contract first
contract B {
    // NOTE: storage layout must be the same as contract A
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(uint256 _num) public payable {
        num = _num; // So storage slot 0 in contract A is set to '_num'
        sender = msg.sender; // ...
        value = msg.value; // ...
        // Even if these variables were not here,the storage slots would still be set
    }
}

contract A {
    // The names are irrelevant, only the storage slots matter
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(address _contract, uint256 _num) public payable {
        // A's storage is set, B is not modified
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }
}
