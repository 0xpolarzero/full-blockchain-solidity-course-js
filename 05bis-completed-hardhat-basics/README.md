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
   cd 05bis-completed-hardhat-basics
   ```
3. Install NPM packages using `yarn` or `npm install`.

## Usage

1. Change the `networks` object in `hardhat.config.js` to match your own network.
2. Change the values for `CONTRACT_ADDRESS` and `STORAGE_SLOT_NUMBER` in `scripts/readStorage.js` to match the contract you want to explore.
3. Run `yarn hardhat run scripts/readStorage.js` to read the storage of the contract.

#

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/05bis-completed-hardhat-basics" id="mission-05"><img src="https://shields.io/badge/Mission%2005bis%20-%20Hardhat%20●%20Retrieve%20from%20Solidity%20Storage-742EC0?style=for-the-badge&logo=target" height="35" /></a>

This is just a very basic script to retrieve a value from a storage location in a Solidity smart contract.

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Hardhat]](https://hardhat.org/)

#

### [Back to the main repo](https://github.com/polar0/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat
