// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

// This is not inside the contract, so it won't take a storage slot
error FundMe__NotOwner();

/**
 * @title FundMe
 * @author polarzero
 * @notice Just a basic Fund Me contract
 */

contract FundMe {
    using PriceConverter for uint256;

    uint256 public number;
    // "constant" keyword allows it to not take a storage spot + easier to read
    // constants are declared LIKE_THIS
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // owner is set only once, but declared in a different line
    // So not a "constant" but a "immutable"
    // That can be called i_likeThis
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    // Can use a modifier to modify any function
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        // More gas efficient
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        // Do what is under the "_" BEFORE the function that has "onlyOwner" in the declaration
        _;
        // Do what is under the "_" AFTER the function that has "onlyOwner" in the declaration
    }

    // The constructor function gets called in the same tx as the contract creation
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // What happens if someone sends this contract Eth without calling the "fund" function ?
    // We can use some special functions -> receive() or fallback()
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    // We need to make the function payable so it can hold Eth
    function fund() public payable {
        // If the minimum fund amount is not met, then the tx is reverted
        // So number is not set to 5
        // BUT gas is spent for anything BEFORE the require
        // BUT the gas spent AFTER require, if not met, will be returned
        number = 5;
        // Set a minimum fund amount
        // This function requires the value (msg.value) to be > 1 Eth
        // require(getConversionRate(msg.value) >= minimumUsd, "Didn't send enough Eth!");
        // BUT now with the library ->
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Didn't send enough Eth!"
        );
        // msg.value is considered as the parameter for getConversionRate

        // Add the funder to the list if it went through
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    // Before calling the function, do what is in "onlyOwner", THEN call the rest of the code
    function withdraw() public onlyOwner {
        // Loop through the funders array and reset it
        // for (start index; end index; stem)
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // Reset the array
        funders = new address[](0);

        // Withdraw the funds
        // msg.sender is of type address
        // payable(msg.sender) is of type payable address
        // Using TRANSFER : if it exceeds 2300 gas, it fails (reverted)
        // msg.sender.transfer(address(this).balance)
        // Using SEND (if it fails, it will return a bool false)
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // Using CALL (no gas limit)
        // If it returns a function, or some value, it will be saved in the variables on the left
        // GENERALY RECOMMANDED
        (
            bool callSuccess, /* bytes memory dataReturned */

        ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
}
