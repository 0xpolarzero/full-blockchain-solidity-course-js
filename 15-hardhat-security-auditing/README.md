AGAIN
2 most common attacks:

- Reentrancy
- Oracle manipulation

→ ALWAYS run `slither` & look for oracle manipulation examples & reentrancy before deploying
→ Don't get any data, RNG, anything from centralized sources (Chainlink is here to help)

`solc-select use 0.8.7 # Solidity version` (or install if not yet installed)

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

Goes in `contracts/test/fuzzing`
We also store `config.yaml` for the docker configuration

See openzeppelin fei audits, sigmaprime & trailofbits

Learning: Ethernaut & Damn Vulnerable Defi

News: rekt.news

List of known attacks: consensys.github.io/smart-contract-best-practices/attacks/
