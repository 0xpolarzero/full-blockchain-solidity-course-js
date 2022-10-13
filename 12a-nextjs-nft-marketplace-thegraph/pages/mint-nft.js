import styles from '../styles/Home.module.css';
import nftAbi from '../constants/BasicNft.json';
import networkMapping from '../constants/networkMapping';
import { writeToContract } from '../systems/interactWithContract';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import { useAccount, useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';

export default function MintNft() {
  const { isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [nftAddress, setNftAddress] = useState('');
  const chainId = chain ? chain.id.toString() : '31337';

  const { write: mintNft, isLoading: isMintLoading } = writeToContract(
    nftAddress,
    nftAbi,
    'mintNft',
    [],
    { onSuccess: handleSuccess, onError: handleError },
  );

  function handleSubmit() {
    mintNft();
    setIsWalletOpen(true);
  }

  async function handleSuccess(tx) {
    const txReceipt = await toast.promise(tx.wait(1), {
      pending: 'Minting NFT...',
      success: 'NFT minted!',
      error: 'Error minting NFT.',
    });
    setIsWalletOpen(false);
  }

  function handleError(err) {
    if (err.code === 'ACTION_REJECTED') {
      toast.error('Transaction rejected.');
    } else {
      toast.error('Error minting NFT.');
    }
    setIsWalletOpen(false);
  }

  useEffect(() => {
    if (chain && networkMapping[chainId]) {
      const currentAddress = networkMapping[chainId]['BasicNft'][0] || '';
      setNftAddress(currentAddress);
    }

    if (chainId === '5' || chainId === '80001' || chainId === '421613') {
      setIsWrongNetwork(false);
    } else {
      setIsWrongNetwork(true);
    }
  }, [chain]);

  return (
    <main className={styles.main}>
      <div className='mint-container content'>
        <div className='box-container'>
          <div className='wrapper mint-wrapper'>
            <h1>Mint your NFT</h1>
            <div className='instructions'>
              <div className='caption'>Ethereum (Goerli)</div>
              <p>
                <span className='highlight'>1.</span> Get some{' '}
                <span className='highlight bold'>Goerli ETH</span> from{' '}
                <a
                  className='highlight bold'
                  href='https://faucets.chain.link/'
                  target={'_blank'}
                >
                  Chainlink Faucets <i className='fa-solid fa-chain'></i>
                </a>
              </p>

              <div className='caption'>Polygon (Mumbai)</div>
              <p>
                <span className='highlight'>1.</span> Get some{' '}
                <span className='highlight bold'>MATIC</span> from{' '}
                <a
                  className='highlight bold'
                  href='https://faucet.polygon.technology/'
                  target={'_blank'}
                >
                  Polygon Faucet <i className='fa-solid fa-chain'></i>
                </a>
              </p>

              <div className='caption'>Arbitrum (Goerli)</div>
              <p>
                <span className='highlight'>1.</span> Follow the instructions in
                the bio of{' '}
                <a
                  className='highlight bold'
                  href='https://mobile.twitter.com/nitro_devnet'
                  target={'_blank'}
                >
                  this account <i className='fa-solid fa-chain'></i>
                </a>{' '}
                to get some <span className='highlight bold'>Goerli ETH</span>
              </p>

              <p>
                <span className='highlight'>2.</span>{' '}
                <span className='highlight bold'>Mint a NFT</span> or buy one
                from the marketplace.
              </p>
              <p>
                <span className='highlight'>3.</span> Then you can{' '}
                <span className='highlight bold'>list it</span> on the
                marketplace.
              </p>
            </div>
            <div className='action'>
              <Button
                type='primary'
                className='mint-btn'
                disabled={isDisconnected || isWrongNetwork}
                loading={isMintLoading || isWalletOpen}
                onClick={handleSubmit}
              >
                Mint
              </Button>
              {isDisconnected ? (
                isWrongNetwork ? (
                  <div className='error bold'>
                    You are on an unsupported network. Please change to Goerli
                    or Mumbai.
                  </div>
                ) : (
                  <div className='error bold'>
                    You must connect your wallet to mint a NFT.
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
