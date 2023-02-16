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
   cd 15-hardhat-security-auditing
   ```
3. Install NPM packages using `yarn` or `npm install`.
4. Create a `.env` file at the root of the project, and populate it with the following variables:
   ```properties
    # See `.env.example` for an example.
   ```

## Usage

Deploy:

```sh
yarn hardhat deploy
```

You can specify the network to deploy to with the `--network` flag, e.g. `yarn hardhat deploy --network goerli`. You can use `mainnet`, `polygon`, `goerli`, `hardhat`, `localhost`. The latter will require you to run a local node first with the following command.

Run a local node:

```sh
yarn hardhat node
```

---

See the scripts written in `package.json` for more commands. Some will require to install additional software (e.g. Docker).

As it is hard to give extensive and accurate notes about this, it would be better to [check out the video at this timestamp](https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=113312s), as it is a quick & very dense section.

#

<a href="https://github.com/0xpolarzero/full-blockchain-solidity-course-js/tree/main/15-hardhat-security-auditing" id="mission-15"><img src="https://shields.io/badge/Mission%2015%20-%20Hardhat%20●%20Security%20&%20Auditing%20(Lesson%2018)-742EC0?style=for-the-badge&logo=target" height="35" /></a>

### Achievements

- Going through the usual auditing process
- Running some preliminary tests with fast & slow tools
  - Slither to expose major vulnerabilities (reentrancy, integer overflow...)
  - Fuzzing with Echidna & using Docker to run a bundle of tools
- Known attacks & best practices to avoid them

### Skills

[![Solidity]](https://soliditylang.org/)
[![JavaScript]](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Hardhat]](https://hardhat.org/)

Introduced to security & auditing tools:

[![OpenZeppelin]](https://openzeppelin.com/)
[![Python]](https://www.python.org/)
[![Docker]](https://www.docker.com/)
[![Slither]](https://github.com/crytic/slither)
[![Echnida]](https://github.com/crytic/echidna)

#

### [Back to the main repo](https://github.com/0xpolarzero/full-blockchain-solidity-course-js)

[solidity]: https://custom-icon-badges.demolab.com/badge/Solidity-3C3C3D?style=for-the-badge&logo=solidity&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black
[hardhat]: https://custom-icon-badges.demolab.com/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat
[openzeppelin]: https://img.shields.io/badge/OpenZeppelin-4E5EE4.svg?style=for-the-badge&logo=OpenZeppelin&logoColor=white
[python]: https://img.shields.io/badge/Python-3776AB.svg?style=for-the-badge&logo=Python&logoColor=white
[docker]: https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white
[slither]: https://custom-icon-badges.demolab.com/badge/Slither-181B22?style=for-the-badge&logo=slither
[echnida]: https://custom-icon-badges.demolab.com/badge/Echnida-181B22?style=for-the-badge&logo=echnida

### The following are personnal notes taken during the course.

#

### 2 most common attacks:

- Reentrancy
- Oracle manipulation

→ ALWAYS run `slither` & look for oracle manipulation examples & reentrancy before deploying
→ Don't get any data, RNG, anything from centralized sources (Chainlink is here to help)

```sh
solc-select use 0.8.7 # Solidity version (or install if not yet installed)
```

## Fast tools

Run `slither` to expose vulnerabilities

```sh
yarn slither # See the script in package.json
```

It will expose the major vulnerabilities in the contracts (e.g. reentrancy, integer overflow, etc.)

## Slow tools: fuzzing / fuzz testing

`echidna` for instance
`docker` is a bundle of tools that can be used to fuzz test

```sh
# The Docker app should be launched
yarn toolbox # See the script in package.json
```

→ Goes in `contracts/test/fuzzing`

We also store `config.yaml` for the docker configuration

## References

### Teams

- [Openzeppelin fei audits](https://blog.openzeppelin.com/fei-protocol-audit/)
- [Sigmaprime](https://sigmaprime.io/)
- [Trail Of Bits](https://www.trailofbits.com/)

### Learning

- [Ethernaut](https://ethernaut.openzeppelin.com/)
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/)

### News & attacks

- [Rekt.news](https://rekt.news/)
- [List of known attacks](consensys.github.io/smart-contract-best-practices/attacks/)
