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
   cd 06-nextjs-smartcontract-lottery
   ```
3. Install NPM packages using `yarn` or `npm install`.

## Usage

1. You can update the contracts addresses in `constants/contractAddresses.json` to match the deployment addresses from `05-hardhat-smartcontract-lottery`:

```json
{
  "5": ["goerli_contract_address"],
  "31337": ["localhost_contract_address"]
}
```

To get it to work locally, you will need to navigate to `05-hardhat-smartcontract-lottery` to run a local node with `yarn hardhat node` and deploy the contracts with `yarn hardhat run scripts/deploy.js --network localhost`.

2. Launch the local development server with `yarn dev` or `npm run dev`.
3. You can also visit the deployed website by [clicking this link](https://weathered-band-7931.on.fleek.co/).

#

<a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js/tree/main/06-nextjs-smartcontract-lottery" id="mission-06"><img src="https://shields.io/badge/Mission%2006%20-%20Next.js%20Front%20End%20●%20Lottery%20Smart%20Contract%20(Lesson%2010)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Using Next.js to build a Front End for the lottery smart contract
- Using Moralis & React hooks to pass data/events through components
- Writing to/reading local storage to keep track of wallets connected
- Using web3uikit to connect a wallet to the provider & dispatch notifications about transactions
- Basic styling with TailwindCSS
- Hosting the website on IPFS
  - Directly pinning the website to a node
  - Using Fleek to host on IPFS & Filecoin

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![ReactJS]](https://reactjs.org/)
[![NextJS]](https://nextjs.org/)
[![Moralis]](https://moralis.io/)
[![IPFS]](https://ipfs.tech/)

#

### [Back to the main repo](https://github.com/0xpolarzero/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[reactjs]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[nextjs]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[ipfs]: https://img.shields.io/badge/IPFS-0A1B2B?style=for-the-badge&logo=ipfs
[moralis]: https://custom-icon-badges.demolab.com/badge/Moralis-2559BB?style=for-the-badge&logo=moralis
