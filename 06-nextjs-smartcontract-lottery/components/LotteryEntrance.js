import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { useNotification } from 'web3uikit';
import { abi, contractAddresses } from '../constants';

const LotteryEntrance = () => {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [recentWinner, setRecentWinner] = useState(0);

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntrancefee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  const { runContractFunction: getParticipantCount } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getParticipantCount',
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntrancefee()).toString();
    const participantCountFromCall = (await getParticipantCount()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setParticipantCount(participantCountFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  const handleNewNotification = (message) => {
    dispatch({
      type: 'success',
      message: message,
      title: 'Tx Notification',
      position: 'topR',
    });
  };

  const handleSuccess = async (tx) => {
    // To make sure the tx really went through
    await tx.wait(1);
    handleNewNotification('Transaction complete!');
    updateUI();
  };

  const handleError = (err) => {
    let message;
    err.code === 4001
      ? (message = 'Transaction rejected.')
      : (message = 'Unknown error.');

    dispatch({
      type: 'error',
      title: 'Error',
      message: message,
      position: 'topR',
    });
    console.log(err);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className='lottery-entrance'>
      <div className='entrance-fee'>
        Entrance fee :{' '}
        <span className='highlight'>
          {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
        </span>
      </div>
      <div className='enter-raffle'>
        {raffleAddress ? (
          <button
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: handleError,
              });
            }}
            disabled={isFetching || isLoading}
          >
            {isLoading || isFetching ? (
              <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div>
            ) : (
              'Enter Raffle'
            )}
          </button>
        ) : (
          <div>No address detected.</div>
        )}
      </div>
      <div className='participant-count'>
        Participants : <span className='highlight'>{participantCount}</span>
      </div>
      <div className='recent-winner'>
        Recent winner :{' '}
        <span className='highlight'>
          {recentWinner
            ? `${recentWinner.slice(0, 6)}...
          ${recentWinner.slice(recentWinner.length - 4)}`
            : 'No winner yet!'}
        </span>
      </div>
    </div>
  );
};

export default LotteryEntrance;
