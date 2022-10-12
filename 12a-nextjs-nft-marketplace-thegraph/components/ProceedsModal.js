import marketplaceAbi from '../constants/NftMarketplace.json';
import networkMapping from '../constants/networkMapping';
import {
  writeToContract,
  readFromContract,
} from '../systems/interactWithContract';
import { roundEth } from '../utils/formatting';
import { Modal } from 'antd';
import { CryptoIcon } from 'next-crypto-icons';
import { toast } from 'react-toastify';
import { useAccount, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function ProceedsModal({ isVisible, hideModal }) {
  const { address: userAddress } = useAccount();
  const { network } = useProvider();
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const userProceeds = readFromContract(
    marketplaceAddress,
    marketplaceAbi,
    'getProceeds',
    [userAddress],
    userAddress,
  );

  const { write: withdrawProceeds, isLoading: isWithdrawLoading } =
    writeToContract(
      marketplaceAddress,
      marketplaceAbi,
      'withdrawProceeds',
      [],
      { onSuccess: handleSuccess, onError: handleError },
      isVisible && userProceeds && userProceeds.toString() !== '0',
    );

  function handleSubmit(e) {
    if (userProceeds.toString() === '0') {
      toast.error('You have no proceeds to withdraw.');
      return;
    }

    withdrawProceeds();
    setIsWalletOpen(true);
    e.stopPropagation();
  }

  async function handleSuccess(tx) {
    const txreceipt = await toast.promise(tx.wait(1), {
      pending: 'Withdrawing proceeds...',
      success: 'Proceeds withdrawn!',
      error: 'Error withdrawing proceeds',
    });
    handleCancel();
  }

  function handleError(err) {
    console.error(err.message);
    if (err.code === 'ACTION_REJECTED') {
      toast.error('Transaction rejected.');
    } else {
      toast.error('Error withdrawing proceeds.');
    }
    handleCancel();
  }

  function handleCancel(e) {
    hideModal();
    setIsWalletOpen(false);
    e && e.stopPropagation();
  }

  useEffect(() => {
    if (network.chainId && networkMapping[network.chainId]) {
      const currentMarketplaceAddress =
        networkMapping[network.chainId]['NftMarketplace'][0] || '';
      setMarketplaceAddress(currentMarketplaceAddress);
    }
  }, [network.chainId]);

  return (
    <Modal
      title='Withdraw Proceeds'
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      onClose={hideModal}
      okButtonProps={{
        loading: isWithdrawLoading || isWalletOpen,
      }}
      okText='Withdraw'
    >
      <div className='withdraw-proceeds'>
        <div className='title'>Your proceeds</div>
        <div className='price'>
          <div className='value'>
            {network.name === 'maticmum' ? (
              <CryptoIcon name='matic' width={20} style={'icon'} />
            ) : (
              <CryptoIcon name='eth' width={20} style={'icon'} />
            )}
            <span>
              {userProceeds && roundEth(userProceeds.toString() || '0')}
            </span>
          </div>
        </div>
      </div>

      <div className='error-message'>{errorMessage}</div>
    </Modal>
  );
}
