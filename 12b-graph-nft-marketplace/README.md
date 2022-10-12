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
   cd 12b-graph-nft-marketplace
   ```
3. Choose one of the submodules, depending on the chain you want to index with the subgraph:
   ```sh
   cd nft-marketplace-arbitrum-goerli
   # or
   cd nft-marketplace-ethereum-goerli
   # or
   cd nft-marketplace-polygon-mumbai
   ```
4. Install NPM packages using `yarn` or `npm install`.

## Usage

Generate types:

```sh
graph codegen
```

Build the subgraph:

```sh
graph build
```

The command to deploy the subgraph will depend on the chain you are deploying to (because it will either be on The Graph Studio or the Hosted Services). You can find the commands in the `package.json` file.

#

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/12a-nextjs-nft-marketplace-thegraph" id="mission-12"><img src="https://shields.io/badge/Mission%2012%20-%20Next.js%20&%20TheGraph%20●%20NFT%20Marketplace%20(Lesson%2015)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

<a href="https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/12a-nextjs-nft-marketplace">Go to the Next.js front end which uses TheGraph to query these subgraphs</a>

The process of building this module is documented in the previous one → <a href='https://github.com/polar0/full-blockchain-solidity-course-js/tree/main/12a-nextjs-nft-marketplace-thegraph'>12a-nextjs-nft-marketplace-thegraph</a>.

### Skills

[![TheGraph]](https://thegraph.com/en/)
[![GraphQL]](https://graphql.org/)

#

### [Back to the main repo](https://github.com/polar0/full-blockchain-solidity-course-js)

[thegraph]: https://custom-icon-badges.demolab.com/badge/TheGraph-0C0A1C?style=for-the-badge&logo=thegraph&logoColor=white
[graphql]: https://img.shields.io/badge/GraphQL-E10098.svg?style=for-the-badge&logo=GraphQL&logoColor=white
