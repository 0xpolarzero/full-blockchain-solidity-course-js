import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} from '../helper-hardhat-config';
import { moveBlocks } from '../utils/move-blocks';

const index = 0;

async function vote(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf8'));
  const proposalId = proposals[network.config.chainId!][proposalIndex];
  console.log(`Voting for proposal ${proposalId}...`);

  const governor = await ethers.getContract('GovernorContract');
  // 0 = No, 1 = Yes, 2 = Abstain
  const voteWay = 1;
  const reason = 'I agree with this proposal!';
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  await voteTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  console.log(`Voted for proposal ${proposalId}!`);
}

vote(index)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
