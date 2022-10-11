<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/polar0/full-blockchain-solidity-course-js">
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
   git clone https://github.com/polar0/full-blockchain-solidity-course-js.git
   ```
2. Navigate into the subdirectory:
   ```sh
   cd 03-hardhat-fund-me
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

You can specify the network to deploy to with the `--network` flag, e.g. `yarn hardhat deploy --network goerli`. You can use `polygon`, `goerli`, `hardhat`, `localhost`. The latter will require you to run a local node first with the following command.

Run a local node:

```sh
yarn hardhat node
```

Run tests:

```sh
yarn hardhat test
```

Report coverage:

```sh
yarn hardhat coverage
```

To get the gas usage report included or not, change `enabled` to `true` or `false` in the hardhat.config.js file.

```properties
gasReporter: {
    enabled: true,
}
```

#

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/03-hardhat-fund-me" id="mission-03"><img src="https://shields.io/badge/Mission%2003%20-%20Hardhat%20●%20Fund%20Me%20(Lesson%207)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Deploying multiple/selected contracts with Hardhat
- Mocking a Chainlink price feed for testing
- Unit & Staging tests
- Interacting with storage in Solidity
- Gas optimization, using storage, immutable & constant variables

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Hardhat]](https://hardhat.org/)
[![Chai]](https://www.chaijs.com/)
[![Mocha]](https://mochajs.org/)
[![Chainlink]](https://chain.link/)

#

### [Back to the main repo](https://github.com/polar0/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat
[chai]: https://img.shields.io/badge/Chai-A30701.svg?style=for-the-badge&logo=Chai&logoColor=white
[mocha]: https://custom-icon-badges.demolab.com/badge/Mocha-87694D?style=for-the-badge&logo=mocha&logoColor=white
[chainlink]: https://img.shields.io/badge/Chainlink-375BD2.svg?style=for-the-badge&logo=Chainlink&logoColor=white
