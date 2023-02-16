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
   cd 08-defi
   ```
3. Install NPM packages using `yarn` or `npm install`.
4. Create a `.env` file at the root of the project, and populate it with the following variables:
   ```properties
    GOERLI_RPC_URL = goerli_rpc_from_provider
    MAINNET_RPC_URL = mainnet_rpc_from_provider
    PRIVATE_KEY = your_wallet_private_key
    ETHERSCAN_API_KEY = your_etherscan_api_key
    COINMARKETCAP_API_KEY = your_coinmarketcap_api_key
   ```

## Usage

Run `yarn hardhat run scripts/aaveBorrow.js` or `npm run hardhat run scripts/aaveBorrow.js` to run the script. It will exchange ETH for wETH, deposit it into Aave, borrow DAI, and repay the loan.

#

<a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js/tree/main/08-defi" id="mission-08"><img src="https://shields.io/badge/Mission%2008%20-%20DeFi%20(Lesson%2013)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Using scripts for borrowing & lending with Aave
  - Using the wETH token contract to exchange ETH for wETH
  - Depositing wETH into Aave
  - Borrowing DAI from Aave
  - Repaying DAI to Aave
- Forking mainnet with Hardhat

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Hardhat]](https://hardhat.org/)
[![Chai]](https://www.chaijs.com/)
[![Mocha]](https://mochajs.org/)
[![Aave]](https://developer.mozilla.org/fr/docs/Web/JavaScript)

#

### [Back to the main repo](https://github.com/0xpolarzero/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat
[chai]: https://img.shields.io/badge/Chai-A30701.svg?style=for-the-badge&logo=Chai&logoColor=white
[mocha]: https://custom-icon-badges.demolab.com/badge/Mocha-87694D?style=for-the-badge&logo=mocha&logoColor=white
[aave]: https://custom-icon-badges.demolab.com/badge/Aave-1C202F?style=for-the-badge&logo=aave
