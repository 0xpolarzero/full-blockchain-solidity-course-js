import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { writeToContract } from '../systems/interactWithContract';
import { roundEth } from '../utils/formatting';

export default function BuyingModal({ props, isVisible, hideModal }) {
  const {
    marketplaceAddress,
    marketplaceAbi,
    nftAddress,
    tokenName,
    tokenId,
    price,
  } = props;
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
  );

  function handleSubmit(e) {
    buyItem();
    setIsWalletOpen(true);
    e.stopPropagation();
  }

  async function handleSuccess(tx) {
    const txReceipt = await tx.wait(1);
    toast.success('Item Bought!', {
      icon: '🎉',
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
          {/* <div className='label'>Price |</div> */}
          <div className='value highlight'>
            <i className='fa-brands fa-ethereum'></i> {roundEth(price)}
          </div>
        </div>
        {userBalance ? (
          <div className='balance'>
            You have <i className='fa-brands fa-ethereum'></i>
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
            more ETH to buy this item.
          </div>
        )}
      </div>
    </Modal>
  );
}
