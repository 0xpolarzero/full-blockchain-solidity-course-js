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
   cd 14-hardhat-daos-typescript
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

See the scripts in `/scripts` to initiate different actions of the governance process.

#

<a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js/tree/main/14-hardhat-daos-typescript" id="mission-14"><img src="https://shields.io/badge/Mission%2014%20-%20Hardhat%20●%20DAOs%20(Lesson%2017)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Building a fully on-chain DAO with a governance token (ERC20) & a voting contract (ERC20)
- The Compound Governance model & OpenZeppelin Contract Wizard:
  - Governance token & Proxy contract
  - The Implementation
  - A `TimeLock` contract to hold the Governance contract for a certain amount of time

### Skills

[![Solidity]](https://soliditylang.org/)
[![TypeScript]](https://www.typescriptlang.org/)
[![Hardhat]](https://hardhat.org/)

#

### [Back to the main repo](https://github.com/0xpolarzero/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[typescript]: https://img.shields.io/badge/TypeScript-007ACC.svg?style=for-the-badge&logo=TypeScript&logoColor=white
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat

### The following are personnal notes taken during the course.

#

Example: compound.finance, governance based on a DAO

→ Everything is written on the blockchain, e.g. 'propose' function for the governance, which stores all the parameters & the description in a transactions

Here we have:

- The 'GovernanceToken' contract
- The 'Box' contract
- The 'GovernorContract' which gets all the logic of the governance
- The 'TimeLock' contract which will hold the 'GovernorContract' for a certain amount of time, to let users to get out if they don't agree with the proposal
