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
   cd 11-nextjs-nft-marketplace-moralis
   ```
3. Install NPM packages using `yarn` or `npm install`.

## Usage

1. You can update the contracts addresses in `constants/contractAddresses.json` to match the deployment addresses from `10-hardhat-nft-marketplace`:

```json
{
  "5": {
    "NftMarketplace": ["ethereum-goerli-marketplace-address"],
    "BasicNft": ["ethereum-goerli-nft-address"]
  },
  "80001": {
    "NftMarketplace": ["polygon-mumbai-marketplace-address"],
    "BasicNft": ["polygon-mumbai-nft-address"]
  },
  "421613": {
    "NftMarketplace": ["arbitrum-goerli-marketplace-address"],
    "BasicNft": ["arbitrum-goerli-nft-address"]
  }
}
```

To get it to work locally, you will need to navigate to `10-hardhat-nft-marketplace` to run a local node with `yarn hardhat node` and deploy the contracts with `yarn hardhat run scripts/deploy.js --network localhost`.

2. Launch the local development server with `yarn dev` or `npm run dev`.

#

<a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js/tree/main/11-nextjs-nft-marketplace-moralis" id="mission-11"><img src="https://shields.io/badge/Mission%2011%20-%20Next.js%20&%20Moralis%20●%20NFT%20Marketplace%20(Lesson%2015)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Connecting Moralis to a local hardhat node
- Using Moralis CLI & Cloud fonctions, triggers & hooks
- Moralis queries, fetching URIs & rendering the NFT images
- Building a front end for buying, listing (updating, canceling) NFTs & witdrawing funds

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![ReactJS]](https://reactjs.org/)
[![NextJS]](https://nextjs.org/)
[![Moralis]](https://moralis.io/)

#

### [Back to the main repo](https://github.com/0xpolarzero/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[reactjs]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[nextjs]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[moralis]: https://custom-icon-badges.demolab.com/badge/Moralis-2559BB?style=for-the-badge&logo=moralis

#

### The following are just personal notes to remember what I did

<br />

- We can't access the listings through the contracts because it would be very gas expensive. If it were an array, same issue.
- → So we will index the events off-chain and then read them from the database
- → Therefore we need a server to listen for these events and store them in the database
- →→ Precisely what Moralis & TheGraph do (respectively centralized & decentralized)

To run locally with Moralis

1. Setup a local server
2. Pass app ID & URL to the Provider
3. Run the `hh node` & front end
4. Go to Moralis Server → `Network` > `Settings` > Need to install a reverse proxy
5. In the frp folder -> run frpc to connect to the server
6. Change `frpc.ini` with the right settings (Ganache/Hardhat)

<strong>OR</strong>

4. Setup a script in `package.json` to run it with the moralis-admin-cli

```json
"moralis:sync": "moralis-admin-cli connect-local-devchain --chain hardhat --moralisSubdomain xxx.usemoralis.com --frpcPath ./frp/frpc"
```

5. Provide `moralisApiKey` and `moralisApiSecret` in the `.env` file (from Moralis > Account > Keys)

→ Once it is running, we can run the `addEvents.js` script to configure the `Sync Smart Contract Events` in Moralis.

--

Whenever the `hh node` is reset, the local chain needs to be reset (as well as the Metamask account).

--

We can setup `cloud functions` to handle this kind of things (e.g. an item listed that has been sold needs to be updated → removed from listings →→ Moralis Cloud).

→ Here: `updateActiveItems` will create a new section that will run when an event is synced, and will add to the table when an item is listed, and remove it when it's bought.

--

As usual, when dealing with a smart contract + front end:

1. Create a `update-front-end` deploy script in the smart contract folder
2. Use the `.env` variable to update or not
3. Create a `constants` folder and a file that will be updated (here with contract addresses) -> a `.json` file with an object (`{}`)

### Centralized dependancies in this project:

- ipfs.io (but the URI is still hosted on IPFS nodes)
- Moralis
