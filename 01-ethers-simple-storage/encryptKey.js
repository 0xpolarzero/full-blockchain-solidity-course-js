const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encrypterJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PROCESS_KEY,
  );

  console.log(encrypterJsonKey);
  fs.writeFileSync('./.encryptedKey.json', encrypterJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
