const { run } = require('hardhat');

const verify = async (contractAddress, args) => {
  console.log('Verifying contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.toLowerCase().includes('already verified')) {
      console.log('Contract already verified');
    } else {
      console.log(err);
    }
  }
};

module.exports = { verify };
