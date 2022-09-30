// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract CallAnything {
    // To call a function using only the data field, we need to encode down to the binary level:
    // - the function name
    // - the parameters to add

    // To get the function name -> we need the 'function selector'
    // => the first 4 bytes of the function signature
    // The 'function signature' == a string that defines the function name & parameters
    // e.g.
    // function signature => 'transfer(address,uint256)'
    // function selector => 0xa9059cbb

    address public s_someAddress;
    uint256 public s_someAmount;

    function transfer(address someAddress, uint256 someAmount) public {
        s_someAddress = someAddress;
        s_someAmount = someAmount;
    }

    // GET THE FUNCTION SELECTOR
    function getSelectorOne() public pure returns (bytes4 selector) {
        // We hash with 'keccak256' the bytes of the signature
        selector = bytes4(keccak256(bytes("transfer(address,uint256)")));
        // return selector;
    }

    // ENCODE THE FUNCTION SELECTOR WITH THE PARAMETERS
    function getDataToCallTransfer(address someAddress, uint256 someAmount)
        public
        pure
        returns (bytes memory)
    {
        // This will take the function selector, and encode it along with the parameters
        // What it returns will be what we put into the data field of the transaction call
        return
            abi.encodeWithSelector(getSelectorOne(), someAddress, someAmount);
    }

    // CALL THE FUNCTION FROM THE CONTRACT WITH THE ENCODED RESULT
    function callTransferFunctionFromBinary(
        address someAddress,
        uint256 someAmount
    ) public returns (bytes4, bool) {
        // What we want to do:
        // address(this).call(getDataToCallTransfer(someAddress, someAmount));
        // But it will return a success bool & whatever the call returns, so:
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSelector(getSelectorOne(), someAddress, someAmount)
            // or the same: getDataToCallTransfer(someAddress, someAmount)
        );

        return (bytes4(returnData), success);
    }

    // 'address(this)' can be changed to whatever contract we want to call

    // OR ANOTHER WAY
    // We can use 'abi.encodeWithSignature' & put the function signature as a parameter
    function callTransferFunctionFromBinaryWithSig(
        address someAddress,
        uint256 someAmount
    ) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSignature(
                "transfer(address,uint256)",
                someAddress,
                someAmount
            )
        );

        return (bytes4(returnData), success);
    }
}
