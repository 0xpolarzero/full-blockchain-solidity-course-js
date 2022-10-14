Example: compound.finance, governance based on a DAO
→ Everything is written on the blockchain, e.g. 'propose' function for the governance, which stores all the parameters & the description in a transactions

Here we have:

- The 'GovernanceToken' contract
- The 'Box' contract
- The GovernorContract which gets all the logic of the governance
- The 'TimeLock' contract which will hold the 'GovernorContract' for a certain amount of time, to let users to get out if they don't agree with the proposal
