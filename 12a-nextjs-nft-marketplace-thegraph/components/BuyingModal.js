import { writeToContract } from '../systems/interactWithContract';
import { roundEth } from '../utils/formatting';
import { Modal } from 'antd';
import { CryptoIcon } from 'next-crypto-icons';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useBalance, useAccount, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function BuyingModal({ props, isVisible, hideModal }) {
  const {
    marketplaceAddress,
    marketplaceAbi,
    nftAddress,
    tokenName,
    tokenId,
    price,
  } = props;
  const { network } = useProvider();
  const { address: userAddress } = useAccount();
  const { data: userBalance } = useBalance({
    addressOrName: userAddress,
  });
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isBalanceEnough, setIsBalanceEnough] = useState(true);
  const [additionalEthNeeded, setAdditionalEthNeeded] = useState(0);
  const {
    write: buyItem,
    isLoading,
    isSuccess,
  } = writeToContract(
    marketplaceAddress,
    marketplaceAbi,
    'buyItem',
    [nftAddress, tokenId, { value: price }],
    { onSuccess: handleSuccess, onError: handleError },
    // Prevent from trying to prepare contract & throwing errors if the modal is not open
    isVisible && nftAddress && tokenId !== '' && price,
  );

  function handleSubmit(e) {
    buyItem();
    setIsWalletOpen(true);
    e.stopPropagation();
  }

  async function handleSuccess(tx) {
    const txReceipt = await toast.promise(tx.wait(1), {
      pending: 'Buying item...',
      success: 'Item bought!',
      error: 'Error buying item.',
    });
    handleCancel();
  }

  function handleError(err) {
    console.error(err.message);
    if (err.code === 'ACTION_REJECTED') {
      toast.error('Transaction rejected.');
    } else {
      toast.error('Error buying item.');
    }
    handleCancel();
  }

  function handleCancel(e) {
    hideModal();
    setIsWalletOpen(false);
    e && e.stopPropagation();
  }

  useEffect(() => {
    if (price && userBalance) {
      const userBalanceBN = ethers.BigNumber.from(userBalance.value);
      const priceBN = ethers.BigNumber.from(price);
      if (userBalanceBN.lt(priceBN)) {
        setIsBalanceEnough(false);
        setAdditionalEthNeeded(priceBN.sub(userBalanceBN).toString());
      } else {
        setIsBalanceEnough(true);
        setAdditionalEthNeeded(0);
      }
    }
  }, [price]);

  return (
    <Modal
      title='Buy item'
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      onClose={hideModal}
      okButtonProps={{
        loading: isLoading || isWalletOpen,
        disabled: !isBalanceEnough,
      }}
      okText='Buy'
    >
      <div className='buy-item'>
        <div className='title'>
          <div className='name'>{tokenName} </div>
          <div className='token-id'>#{tokenId}</div>
        </div>
        <div className='price'>
          <div className='value'>
            {network.name === 'maticmum' ? (
              <CryptoIcon name='matic' width={20} style={'color'} />
            ) : (
              <CryptoIcon name='eth' width={20} style={'color'} />
            )}
            {roundEth(price)}
          </div>
        </div>
        {userBalance ? (
          <div className='balance'>
            You have
            {network.name === 'maticmum' ? (
              <CryptoIcon name='matic' width={20} style={'icon'} />
            ) : (
              <CryptoIcon name='eth' width={20} style={'icon'} />
            )}
            <span className='ether-value'>
              {' '}
              {roundEth(userBalance.value.toString())}{' '}
            </span>
            in your wallet.
          </div>
        ) : (
          ''
        )}

        {!isBalanceEnough && (
          <div className='error-message'>
            You need{' '}
            <span className='ether-value'>{roundEth(additionalEthNeeded)}</span>{' '}
            more {network.name === 'maticmum' ? 'MATIC' : 'ETH'} to buy this
            item.
          </div>
        )}
      </div>
    </Modal>
  );
}
