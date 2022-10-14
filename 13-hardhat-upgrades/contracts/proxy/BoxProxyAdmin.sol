// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

pragma solidity ^0.8.8;

contract BoxProxyAdmin is ProxyAdmin {
    constructor(
        address /* owner */
    ) ProxyAdmin() {}
}
