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
   cd 12a-nextjs-nft-marketplace-thegraph
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

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/12a-nextjs-nft-marketplace-thegraph" id="mission-12"><img src="https://shields.io/badge/Mission%2012%20-%20Next.js%20&%20TheGraph%20●%20NFT%20Marketplace%20(Lesson%2015)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/12b-graph-nft-marketplace">Go to the TheGraph configuration submodule (`12b-graph-nft-marketplace`)</a>

### Achievements

- Building a subgraph to index the marketplace contract events (The Graph Studio)
- Using The Graph CLI to deploy the subgraph
- Querying the subgraph with GraphQL & Apollo client
- Hosting the Marketplace:
  - Fleek (IPFS): https://calm-forest-4357.on.fleek.co/
  - Vercel: https://nextjs-nft-marketplace-thegraph-murex.vercel.app/

### Bonus achievements

- Customizing the UI & UX
- Building a minting page for the NFT that can be listed
- Handling notifications: success, error & displaying pending transactions with React-Toastify
- Displaying 3 different marketplace listing pages for the chains it's deployed on (Polygon, Arbitrum & Ethereum testnets)
- Deploying 3 different subgraphs with The Graph Studio & Hosted Services on these 3 networks
- Listings filtering (All & Owned by the user)

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![ReactJS]](https://reactjs.org/)
[![NextJS]](https://nextjs.org/)
[![TheGraph]](https://thegraph.com/en/)
[![ApolloGraphQL]](https://www.apollographql.com/)
[![GraphQL]](https://graphql.org/)
[![Rainbow]](https://www.rainbowkit.com/)
[![Wagmi]](https://wagmi.sh/)
[![Antd]](https://ant.design/)

#

### [Back to the main repo](https://github.com/polar0/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[reactjs]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[nextjs]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[rainbow]: https://custom-icon-badges.demolab.com/badge/Rainbowkit-032463?style=for-the-badge&logo=rainbow
[wagmi]: https://custom-icon-badges.demolab.com/badge/Wagmi-1C1B1B?style=for-the-badge&logo=wagmi
[antd]: https://img.shields.io/badge/Ant%20Design-0170FE.svg?style=for-the-badge&logo=Ant-Design&logoColor=white
[thegraph]: https://custom-icon-badges.demolab.com/badge/TheGraph-0C0A1C?style=for-the-badge&logo=thegraph&logoColor=white
[apollographql]: https://img.shields.io/badge/Apollo%20GraphQL-311C87.svg?style=for-the-badge&logo=Apollo-GraphQL&logoColor=white
[graphql]: https://img.shields.io/badge/GraphQL-E10098.svg?style=for-the-badge&logo=GraphQL&logoColor=white
