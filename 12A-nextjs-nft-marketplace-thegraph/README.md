Here we can't access the listings through the contracts because it would be very gas expensive. If it were an array, same issue.
-> So we will index the events off-chain and then read them from the database
-> So we need a server to listen for these events and store them in the database
--> Exactly what Moralis & TheGraph do (respectively centralized & decentralized)

To run locally with Moralis

1. Setup a local server
2. Pass app ID & URL to the Provider
3. Run the hh node & front end
4. Go to Moralis Server `Network` > `Settings` > Need to install a reverse proxy
5. In the frp folder -> run frpc to connect to the server
6. Change `frpc.ini` with the right settings (Ganache/Hardhat)

OR

4. Setup a script in `package.json` to run it with the moralis-admin-cli

```json
"moralis:sync": "moralis-admin-cli connect-local-devchain --chain hardhat --moralisSubdomain xxx.usemoralis.com --frpcPath ./frp/frpc"
```

5. Provide `moralisApiKey` and `moralisApiSecret` in the `.env` file (from Moralis > Account > Keys)

--> Once it is running, we can run the `addEvents.js` script to configure the `Sync Smart Contract Events` in Moralis
-- The local chain needs to be reset in Moralis dashboard if the hh node is reset.
-- We can setup cloud functions to handle this kind of things (e.g. an item listed that has been sold needs to be updated -> removed from listings => Moralis Cloud).
===> Here: `updateActiveItems` will create a new section that will run when an event is synced, and will add to the table when an item is listed, and remove it when it's bought.

As usual, when dealing with a smart contract + front end:

1. Create a `update-front-end` deploy script in the smart contract folder
2. Use the .env variable to update or not
3. Create a `constants` folder and a file that will be updated (here with contract addresses) -> a `.json` file with an object (`{}`)

## Centralized dependancies:

- ipfs.io (but the URI is still hosted on IPFS nodes)
- Moralis
- Loading.io (icons)

# Bonus achievements

- UI & UX customization
- Use Rainbowkit & Wagmi for the wallet connection, transactions, etc
- Use Antd for the UI (Modal, buttons, inputs)
- NFT Minting page
- Filters (All listings & User listings)
  MAYBE LATER - Listening events for the NFT contract to track user's NFTs
