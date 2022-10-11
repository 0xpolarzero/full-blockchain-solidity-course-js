// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Manualtoken {
    uint256 initialSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function _transfer(
        address from,
        address to,
        uint256 value
    ) public {
        balanceOf[from] -= value;
        balanceOf[to] += value;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }
}
