// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Encoding {
    function combineStrings() public pure returns (string memory) {
        return string(abi.encodePacked("Hi", " there"));
        // Now since 0.8.12 we can just do:
        // string.concat(stringA, stringB);
        // BUT abi.encodePacked does way more
        // vvvvv
    }

    function encodeNumber() public pure returns (bytes memory) {
        // bytes memory number = abi.encode(1);
        // return number;
        return bytes(abi.encode(1));
    }

    function encodeString() public pure returns (bytes memory) {
        // bytes memory someString = abi.encode("some string");
        return bytes(abi.encode("some string"));
    }

    // encodePacked() is kind of the "compressed" version of encode()
    // The bytes generated is way shorter, so more gas efficient
    function encodeStringPacked() public pure returns (bytes memory) {
        return bytes(abi.encodePacked("some string"));
    }

    // It gives the same response, but not with the same process
    function encodeStringBytes() public pure returns (bytes memory) {
        return bytes(bytes("some string"));
    }

    function decodeString() public pure returns (string memory) {
        // Take the result of encodeString() and decode it into a string
        return string(abi.decode(encodeString(), (string)));
    }

    // Which also works with several parameters
    function multiEncode() public pure returns (bytes memory) {
        return bytes(abi.encode("some string", "another string"));
    }

    function multiDecode() public pure returns (string memory, string memory) {
        (string memory someString, string memory someOtherString) = abi.decode(
            multiEncode(),
            (string, string)
        );
        return (someString, someOtherString);
    }

    // And with the packed version as well
    function multiEncodePacked() public pure returns (bytes memory) {
        return bytes(abi.encodePacked("some string", "another string"));
    }

    // This won't work because it's packed
    function multiDecodePacked() public pure returns (string memory) {
        return string(abi.decode(multiEncodePacked(), (string)));
    }

    // But this does
    // Because packed encoding is kind of similar to type casting
    function multiStringCastPacked() public pure returns (string memory) {
        return string(string(multiEncodePacked()));
    }

    // This is actually what happens at a low level

    // e.g. take the Raffle contract:
    // Function: enterRaffle()
    // gets encoded to:
    // 0x2cfcc539

    // We actually don't need the whole ABI to interact with a contract
    // What we really need is the function name & its input types to make a function call

    // call: Calls a function to change the state of the blockchain
    // staticcall: At a low level 'view' or 'pure' function calls, just get a return value ->
    // -> w/o changing the state of the blockchain

    // e.g. with that part of the fulfillRandomWords function:
    // (bool success, ) = recentWinner.call{value: address(this).balance}("");
    // We can actually put data inside the ("") which is the calldata, e.g. a specific function
    // We can also put other firlds of the tx inside the {} : gasLimit, gasPrice...

    // Then how to send a transaction that call a function with just the data field ?
    // How to populate the data field ?
    // ---> CallAnything.sol
}
