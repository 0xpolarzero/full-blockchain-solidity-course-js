<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js">
    <img src="../images/blockchain.png" alt="Logo" width="80" height="80">
  </a>

<h2 align="center">Full Blockchain, Solidity & Full-Stack Web3 development with JavaScript </h3>

  <p align="center">
    Everything related to my progress through <a href="https://youtu.be/gyMwXuJrbJQ">this course from Patrick Collins</a>
    <br />
    <a href="https://youtu.be/gyMwXuJrbJQ"><strong>Go to the video »</strong></a>
  </p>
</div>

<br />

# Trying out / testing

<p>To get a local copy up and running follow these simple example steps.</p>
<p>You will need to install either <strong>npm</strong> or <strong>yarn</strong> to run the commands, and <strong>git</strong> to clone the repository.</p>

## Installation

1. Clone the whole repo:
   ```sh
   git clone https://github.com/0xpolarzero/full-blockchain-solidity-course-js.git
   ```
2. Navigate into the subdirectory:
   ```sh
   cd 13-hardhat-upgrades
   ```
3. Install NPM packages using `yarn` or `npm install`.
4. Create a `.env` file at the root of the project, and populate it with the following variables:
   ```properties
    GOERLI_RPC_URL = goerli_rpc_from_provider
    PRIVATE_KEY = your_wallet_private_key
    ETHERSCAN_API_KEY = your_etherscan_api_key
    COINMARKETCAP_API_KEY = your_coinmarketcap_api_key
   ```

## Usage

Deploy:

```sh
yarn hardhat deploy
```

You can specify the network to deploy to with the `--network` flag, e.g. `yarn hardhat deploy --network goerli`. You can use `goerli`, `hardhat`, `localhost`. The latter will require you to run a local node first with the following command.

Run a local node:

```sh
yarn hardhat node
```

---

See the scripts in `/scripts` to upgrade the Box contract manually or with the Hardhat OpenZeppelin plugin.

#

<a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js/tree/main/13-hardhat-upgrades" id="mission-13"><img src="https://shields.io/badge/Mission%2013%20-%20Hardhat%20●%20Upgrades%20(Lesson%2016)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Overview of the different ways to upgrade a contract (directly through parameters, social migration, proxy)
- Manually upgrading a contract with Hardhat
- Using the OpenZeppelin Upgrades plugin to deploy & upgrade a smart contract
- Proxies & Implementations, `delegatecall`, storage & function selector clashes
- Proxy patterns: Transparent, Upgradeable (UUPS), Diamond

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Hardhat]](https://hardhat.org/)

#

### [Back to the main repo](https://github.com/0xpolarzero/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat

### The following are personnal notes taken during the course.

#

## Different ways to upgrade a contract

- Parameters in the contract (e.g. setter functions)
- Social Migration (moving everything to a new contract)
- Proxy

### Proxies

- Using `delegatecall`, where the code is executed in the calling contract's context
  → A call to the new contract (contract B) would be executed in the context of the old contract (contract A)
  → Contract B logic is executed in contract A
  →→ The proxy contract can keep the same address forever and point to other contracts, an upgrade will lead to a new implementation

1. The <strong>Implementation Contract</strong> which has all the logic. To upgrade, a new implementation contract is deployed.
2. The <strong>Proxy Contract</strong> which points to the updated implementation, and forwards all calls to it. It is the contract that is called by the user.

DANGERS

- Storage clashes:
  → If the new contract has a different storage layout, it will clash with the old contract
- Function selector clashes
  → Two different function can be drastically differents, but have the same function selector. e.g. `function collate_propagate_storage(bytes16) external {}` & `function burn(uint256) external {}`

So we need <strong>Proxy Patterns</strong> to avoid these problems.

- Transparent Proxy Pattern
  → Admins can call only governance functions, and no function from the implementation contract
  → Users can only call functions from the implementation contract

- Upgradeable Proxy Pattern
  → All the logic of upgrading is placed in the implementation contract

- Diamand Pattern
  → Multi implementation contracts

### `delegatecall`

It can be thought of as a function that allows a contract to borrow a function from another contract.

## With Hardhat

### Deploying the proxy

3 solutions to deploy the proxy:

1. Manually as we do usually
2. With Hardhat built-in proxy

```javascript
await deploy('Contract'),
  {
    from: deployer,
    proxy: true,
  };
```

3. Upgrade plugin from Openzeppelin
   → `{upgrades}` in hardhat
   → `upgrades.deployProxy` → `upgrades.prepareUpgrade` → `upgrades.upgradeProxy`
