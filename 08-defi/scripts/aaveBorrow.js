const { getNamedAccounts, ethers, network } = require('hardhat');
const { networkConfig } = require('../helper-hardhat-config');
const { getWeth, AMOUNT } = require('../scripts/getWeth');

async function main() {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending pool address: ${lendingPool.address}`);

  // Approve the lending pool to use wETH
  const wethTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);

  // Deposit the amount
  console.log(`Depositing ${ethers.utils.formatEther(AMOUNT)} wETH...`);
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log(
    `Successfully deposited ${ethers.utils.formatEther(AMOUNT)} wETH`,
  );

  // Borrow some DAI
  let { totalDeptETH, availableBorrowsETH } = await getBorrowUserData(
    lendingPool,
    deployer,
  );
  const daiPrice = await getDaiPrice();
  const daiAmountToBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / Number(daiPrice));
  console.log(`You can borrow ${daiAmountToBorrow} DAI...`);
  const daiAmountToBorrowWei = ethers.utils.parseEther(
    daiAmountToBorrow.toString(),
  );
  const daiTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  await borrowDai(daiTokenAddress, lendingPool, daiAmountToBorrowWei, deployer);

  // Repay the DAI
  await getBorrowUserData(lendingPool, deployer);
  await repayDai(daiTokenAddress, lendingPool, daiAmountToBorrowWei, deployer);
  await getBorrowUserData(lendingPool, deployer);
}

async function getLendingPool(account) {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    account,
  );
  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    account,
  );
  return lendingPool;
}

async function approveErc20(
  erc20Address,
  spenderAddress,
  amountToSpend,
  account,
) {
  console.log('Approving the lending pool to use wETH...');
  const erc20Token = await ethers.getContractAt(
    'IERC20',
    erc20Address,
    account,
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log('Successfully approved the lending pool to use wETH');
}

async function getBorrowUserData(lendingPool, account) {
  const {
    totalCollateralETH,
    totalDebtETH,
    availableBorrowsETH,
  } = await lendingPool.getUserAccountData(account);
  console.log(
    `Total collateral (deposited): ${ethers.utils.formatEther(
      totalCollateralETH,
    )}`,
  );
  console.log(
    `Total debt (borrowed): ${ethers.utils.formatEther(totalDebtETH)}`,
  );
  console.log(
    `Available borrows: ${ethers.utils.formatEther(availableBorrowsETH)}`,
  );

  return { totalDebtETH, availableBorrowsETH };
}

async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    '0x773616E4d11A78F511299002da57A0a94577F1f4',
  );
  const price = (await daiEthPriceFeed.latestRoundData()).answer;
  console.log(`DAI price: ${ethers.utils.formatEther(price)} ETH`);

  return price;
}

async function borrowDai(
  daiAddress,
  lendingPool,
  daiAmountToBorrowWei,
  account,
) {
  console.log(
    `Borrowing ${ethers.utils.formatEther(daiAmountToBorrowWei)} DAI...`,
  );
  const tx = await lendingPool.borrow(
    daiAddress,
    daiAmountToBorrowWei,
    1,
    0,
    account,
  );
  console.log(
    `Successfully borrowed ${ethers.utils.formatEther(
      daiAmountToBorrowWei,
    )} DAI`,
  );
}

async function repayDai(daiAddress, lendingPool, daiAmountToRepayWei, account) {
  await approveErc20(
    daiAddress,
    lendingPool.address,
    daiAmountToRepayWei,
    account,
  );
  const tx = await lendingPool.repay(
    daiAddress,
    daiAmountToRepayWei,
    1,
    account,
  );
  await tx.wait(1);
  console.log(`Successfully repaid ${daiAmountToRepayWei} DAI`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
