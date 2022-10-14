# Different ways to upgrade a contract

- Parameters in the contract (e.g. setter functions)
- Social Migration (moving everything to a new contract)
- Proxy

## Proxies

- Using `delegatecall`, where the code is executed in the calling contract's context
  → A call to the new contract (contract B) would be executed in the context of the old contract (contract A)
  → Contract B logic is executed in contract A
  →→ The proxy contract can keep the same address forever and point to other contracts, an upgrade will lead to a new implementation

1. The <strong>Implementation Contract</strong> which has all the logic. To upgrade, a new implementation contract is deployed.
2. The <strong>Proxy Contract</strong> which points to the updated implementation, and forwards all calls to it. It is the contract that is called by the user.

DANGERS

- Storage clashes:
  → If the new contract has a different storage layout, it will clash with the old contract
- Function selector clashes
  → Two different function can be drastically differents, but have the same function selector. e.g. `function collate_propagate_storage(bytes16) external {}` & `function burn(uint256) external {}`

So we need <strong>Proxy Patterns</strong> to avoid these problems.

- Transparent Proxy Pattern
  → Admins can call only governance functions, and no function from the implementation contract
  → Users can only call functions from the implementation contract

- Upgradeable Proxy Pattern
  → All the logic of upgrading is placed in the implementation contract

- Diamand Pattern
  → Multi implementation contracts

### `delegatecall`

It can be thought of as a function that allows a contract to borrow a function from another contract.

# With Hardhat

## Deploying the proxy

3 solutions to deploy the proxy:

1. Manually as we do usually
2. With Hardhat built-in proxy

```javascript
await deploy('Contract'),
  {
    from: deployer,
    proxy: true,
  };
```

3. Upgrade plugin from Openzeppelin
   → `{upgrades}` in hardhat
   → `upgrades.deployProxy` → `upgrades.prepareUpgrade` → `upgrades.upgradeProxy`
