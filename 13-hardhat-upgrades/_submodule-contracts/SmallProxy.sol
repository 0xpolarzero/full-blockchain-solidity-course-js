// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Uses Yul: intermediate language for the EVM (can be compiled to bytecode for different backends)
// We want to use it as little as possible to not screw up the stack
// But here we need to in the 'assembly' sections

import "@openzeppelin/contracts/proxy/Proxy.sol";

// That Proxy contract has a 'fallback' function with a 'delegatecall'
// ... that will call the specified 'implementation' contract
contract SmallProxy is Proxy {
    // This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    function setImplementation(address newImplementation) public {
        assembly {
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
    }

    function _implementation()
        internal
        view
        override
        returns (address implementationAddress)
    {
        assembly {
            implementationAddress := sload(_IMPLEMENTATION_SLOT)
        }
    }

    // It returns the signature with the selector & the arguments
    // ... but it won't find that function in the Proxy contract
    // ... so it will call the 'fallback' function, which will call the '_delegate' function
    // ... which will call the 'implementation' contract
    function getDataToTransact(uint256 numberToUpdate)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature("setValue(uint256)", numberToUpdate);
    }

    function readStorage()
        public
        view
        returns (uint256 valueAtStorageSlotZero)
    {
        assembly {
            valueAtStorageSlotZero := sload(0)
        }
    }
}

contract ImplementationA {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue;
    }
}

contract ImplementationB {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue + 2;
    }
}

// BUT e.g. we have a 'function setImplementation(){}' in the Proxy contract
// ... and a function with the same selector in the Implementation contract
// ... it won't ever get called

// -> Helps to use a Transparent Proxy -> Ok, only admins can call functions on the proxy
// ... anyone else ALWAYS gets sent to the fallback contract.

// -> Also with Universal Upgradable Proxy -> All upgrade logic is in the implementation contract, and
// ... you can't have 2 functions with the same function selector.
