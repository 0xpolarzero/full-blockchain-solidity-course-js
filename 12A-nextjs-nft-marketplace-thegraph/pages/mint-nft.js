import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import nftAbi from '../constants/BasicNft.json';
import networkMapping from '../constants/networkMapping.json';
import { writeToContract } from '../systems/interactWithContract';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import { useAccount, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function MintNft() {
  const { isDisconnected } = useAccount();
  const { network } = useProvider();
  const [nftAddress, setNftAddress] = useState('');
  const [isWalletOpen, setIsWalletOpen] = useState(false);

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
    if (network.chainId && networkMapping[network.chainId]) {
      const currentAddress =
        networkMapping[network.chainId]['BasicNft'][0] || '';
      setNftAddress(currentAddress);
    }
  }, [network.chainId]);

  return (
    <div>
      <header className={styles.header}>
        <Header />
      </header>

      <main className={styles.main}>
        <div className='mint-container content'>
          <div className='box-container'>
            <div className='wrapper mint-wrapper'>
              <h1>Mint your NFT</h1>
              <div className='instructions'>
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
                  .
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
                  disabled={isDisconnected}
                  loading={isMintLoading || isWalletOpen}
                  onClick={handleSubmit}
                >
                  Mint
                </Button>
                {isDisconnected ? (
                  <div className='error not-connected'>
                    You must connect your wallet to mint a NFT.
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
