// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__NotEnoughETHToEnter();
error Raffle__TransferFailed();
error Raffle__RaffleClosed();
error Raffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 raffleState
);

/**
 * @title A sample Raffle contract
 * @author polarzero
 * @notice This contract is used to try out how to use Chainlink Keepers to maintain a raffle
 * @dev This uses Chainlink VRF v2 & Chainlink Keepers to pick a winner
 */

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Types */
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    /* State variables */
    uint256 private immutable i_entranceFee;
    address payable[] private s_participants;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    /* Lottery variables */
    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Events */
    event RaffleEntered(address indexed participant);
    event RequestedRaffleWinner(uint256 requestId);
    event WinnerPicked(address indexed winner);

    /* Functions */
    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHToEnter();
        }

        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__RaffleClosed();
        }
        s_participants.push(payable(msg.sender));
        // Emit an event to a data array outside of the smart contract
        emit RaffleEntered(msg.sender);
    }

    /**
     * @dev This is the function called by the Chainlink Keeper.
     * It will look for the 'updkeepNeeded' to return true.
     * If true, it will call the 'performUpkeep' function.
     * To be true, it needs
     * - the time interval to be passed.
     * - the lottery to have at least 1 participant, and some ETH
     * - the subscription to be funded with LINK
     * - the lottery to be in an 'open' state
     */

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = (s_raffleState == RaffleState.OPEN);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasParticipants = (s_participants.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasParticipants && hasBalance);
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_participants.length,
                uint256(s_raffleState)
            );
        }
        s_raffleState = RaffleState.CALCULATING;

        // Request the random number
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // the max price we are willing to pay
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // Get the winner
        uint256 indexOfWinner = randomWords[0] % s_participants.length;
        address payable recentWinner = s_participants[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;

        // Reset the participants array
        s_participants = new address payable[](0);
        s_lastTimeStamp = block.timestamp;

        // Send the winner their prize
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        // Keep the history of winners
        emit WinnerPicked(recentWinner);
    }

    /* Getter functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getParticipant(uint256 index) public view returns (address) {
        return s_participants[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getParticipantCount() public view returns (uint256) {
        return s_participants.length;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
