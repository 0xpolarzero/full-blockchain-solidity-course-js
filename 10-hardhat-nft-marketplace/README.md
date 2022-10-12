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
   cd 10-hardhat-nft-marketplace
   ```
3. Install NPM packages using `yarn` or `npm install`.
4. Create a `.env` file at the root of the project, and populate it with the following variables:
   ```properties
    GOERLI_RPC_URL = goerli_rpc_from_provider
    PRIVATE_KEY = your_wallet_private_key
    ETHERSCAN_API_KEY = your_etherscan_api_key
    COINMARKETCAP_API_KEY = your_coinmarketcap_api_key
    # For Polygon (Mumbai)
    MUMBAI_RPC_URL = mumbai_rpc_from_provider
    POLYGONSCAN_API_KEY = your_polygon_api_key
    # For Arbitrum (Goerli)
    ARBITRUM_GOERLI_RPC_URL = arbitrum_goerli_rpc_from_provider
    ARBISCAN_API_KEY = your_arbiscan_api_key
   ```
   You can ignore Polygon and Arbitrum variables if you don't want to deploy to those networks. You will also need to remove them from the `hardhat.config.js` file.

## Usage

Deploy:

```sh
yarn hardhat deploy
```

You can specify the network to deploy to with the `--network` flag, e.g. `yarn hardhat deploy --network goerli`. You can use `goerli`, `mumbai`, `arbitrumGoerli`, `hardhat`, `localhost`. The latter will require you to run a local node first with the following command.

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

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/10-hardhat-nft-marketplace" id="mission-10"><img src="https://shields.io/badge/Mission%2010%20-%20Hardhat%20●%20NFT%20Marketplace%20(Lesson%2015)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Creating a marketplace for NFTs based on the ERC721 standard
- Pull over push considerations, reentrancy attacks
- Advanced events & modifiers, security improvements
- Writing various scripts to interact with the contract

### Bonus achievements

- Deploying the marketplace & NFT contracts to Polygon (Mumbai) & Arbitrum (Goerli) (cf. Mission 12)

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Hardhat]](https://hardhat.org/)
[![Chai]](https://www.chaijs.com/)
[![Mocha]](https://mochajs.org/)

#

### [Back to the main repo](https://github.com/polar0/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat
[chai]: https://img.shields.io/badge/Chai-A30701.svg?style=for-the-badge&logo=Chai&logoColor=white
[mocha]: https://custom-icon-badges.demolab.com/badge/Mocha-87694D?style=for-the-badge&logo=mocha&logoColor=white
