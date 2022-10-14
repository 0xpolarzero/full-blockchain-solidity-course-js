import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import {
  proposalsFile,
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
} from '../helper-hardhat-config';
import { moveBlocks } from '../utils/move-blocks';

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string,
) {
  const governor = await ethers.getContract('GovernorContract');
  const box = await ethers.getContract('Box');
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args,
  );

  console.log(
    `Proposing to call ${functionToCall} with args ${args} on ${box.address}`,
  );
  console.log(`Proposal description: ${proposalDescription}`);

  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription,
  );

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposeTxReceipt = await proposeTx.wait(1);
  const proposalId = proposeTxReceipt.events[0].args.proposalId;
  console.log(`Proposal created with id ${proposalId}`);

  storeProposalId(proposalId);
}

function storeProposalId(proposalId: any) {
  const chainId = network.config.chainId!.toString();
  let proposals: any;

  if (fs.existsSync(proposalsFile)) {
    proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf8'));
  } else {
    proposals = {};
    proposals[chainId] = [];
  }

  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals), 'utf8');

  console.log(`Proposal id ${proposalId} stored in ${proposalsFile}`);
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
