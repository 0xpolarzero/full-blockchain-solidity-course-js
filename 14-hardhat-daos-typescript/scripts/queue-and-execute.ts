import { ethers, network } from 'hardhat';
import {
  developmentChains,
  FUNC,
  MIN_DELAY,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
} from '../helper-hardhat-config';
import { moveBlocks } from '../utils/move-blocks';
import { moveTime } from '../utils/move-time';

export async function queueAndExecute() {
  const box = await ethers.getContract('Box');
  const args = [NEW_STORE_VALUE];
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION),
  );

  const governor = await ethers.getContract('GovernorContract');
  console.log('Queueing proposal...');
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash,
  );
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log('Proposal queued!');

  console.log('Ececuting proposal...');
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash,
  );
  await executeTx.wait(1);
  console.log('Proposal executed!');

  const boxNewValue = await box.retrieve();
  console.log('Box value after proposal execution:', boxNewValue.toString());
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
