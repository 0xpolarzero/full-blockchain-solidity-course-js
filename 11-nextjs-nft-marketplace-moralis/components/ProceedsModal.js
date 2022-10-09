import marketplaceAbi from '../constants/NftMarketplace.json';
import networkMapping from '../constants/networkMapping.json';
import { writeToContract } from '../systems/interactWithContract';
import { roundEth } from '../utils/formatting';
import { Modal, Input, InputNumber, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useAccount, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function ProceedsModal({ isVisible, hideModal }) {
  const { address: userAddress } = useAccount();
  const { network } = useProvider();
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const [nftAddress, setNftAddress] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [formattedPrice, setFormattedPrice] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { write: approveMarketplace, isLoading: isApproveLoading } =
    writeToContract(
      nftAddress,
      nftAbi,
      'approve',
      [marketplaceAddress, tokenId],
      { onSuccess: handleApproveSuccess, onError: handleError },
    );

  const { write: listItem, isLoading: isListItemLoading } = writeToContract(
    marketplaceAddress,
    marketplaceAbi,
    'listItem',
    [nftAddress, tokenId, formattedPrice],
    { onSuccess: handleListingSuccess, onError: handleError },
    false,
  );

  function copyNftAddress() {
    navigator.clipboard.writeText(nftAddress);
    toast.info('NFT Contract address copied to clipboard!');
  }

  function handleSubmit(e) {
    approveMarketplace();
    setIsWalletOpen(true);
    e.stopPropagation();
  }

  async function handleApproveSuccess(tx) {
    const txReceipt = await tx.wait(1);
    toast.success('Item approved for sale.');
    listItem();
  }

  async function handleListingSuccess(tx) {
    const txReceipt = await tx.wait(1);
    toast.success('Item listed!');
    handleCancel();
  }

  function handleError(err) {
    console.error(err.message);
    if (err.code === 'ACTION_REJECTED') {
      toast.error('Transaction rejected.');
    } else {
      toast.error('Error listing item.');
    }
    handleCancel();
  }

  function handleCancel(e) {
    hideModal();
    setIsWalletOpen(false);
    setTokenId('');
    setPrice('');
    e && e.stopPropagation();
  }

  async function handleChange(value, type) {
    setErrorMessage('');

    if (value === null) {
      setIsFormValid(false);
      return;
    }

    if (type === 'tokenId') {
      setTokenId(value);
    } else if (type === 'price') {
      setPrice(value);
      const priceInWei = ethers.utils.parseEther(value.toString());
      setFormattedPrice(priceInWei.toString());
    }
  }

  useEffect(() => {
    if (network.chainId && networkMapping[network.chainId]) {
      const currentMarketplaceAddress =
        networkMapping[network.chainId]['NftMarketplace'][0] || '';
      setMarketplaceAddress(currentMarketplaceAddress);
      const currentNftAddress =
        networkMapping[network.chainId]['BasicNft'][0] || '';
      setNftAddress(currentNftAddress);
    }
  }, [network.chainId]);

  return (
    <Modal
      title='List item'
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      onClose={hideModal}
      okButtonProps={{
        loading: isListItemLoading || isWalletOpen,
        // disabled: !isBalanceEnough,
      }}
      okText='List'
    >
      <div className='list-item'>
        <div className='list-address'>
          <label htmlFor='list-address-input'>NFT Address</label>
          <Input
            id='list-address-input'
            type='text'
            value={nftAddress}
            // prefix='#'
            suffix={
              <div className='nft-address-tooltip'>
                <i className='fa-solid fa-copy' onClick={copyNftAddress}></i>
                <Tooltip title='The address of the NFT Contract'>
                  <InfoCircleOutlined
                    style={{ color: 'rgba(255,255,255,.75)' }}
                  />
                </Tooltip>
              </div>
            }
            disabled={true}
          />
        </div>
        <div className='list-token-id'>
          <label htmlFor='list-token-id-input'>Token ID</label>
          <InputNumber
            id='list-token-id-input'
            type='number'
            autoFocus={true}
            placeholder='0'
            prefix='#'
            addonAfter={
              <Tooltip title='Enter the ID of the token you want to list'>
                <InfoCircleOutlined
                  style={{ color: 'rgba(255,255,255,.75)' }}
                />
              </Tooltip>
            }
            onChange={(e) => handleChange(e, 'tokenId')}
            min={0}
            value={tokenId}
          />
        </div>
        <div className='list-price'>
          <label htmlFor='list-price-input'>Price</label>
          <InputNumber
            id='list-price-input'
            type='number'
            placeholder='0'
            prefix={<i className='fa-brands fa-ethereum'></i>}
            addonAfter={
              <Tooltip title='Enter the price for the NFT (in ETH)'>
                <InfoCircleOutlined
                  style={{ color: 'rgba(255,255,255,.75)' }}
                />
              </Tooltip>
            }
            onChange={(e) => handleChange(e, 'price')}
            min={0}
            value={price}
          />
        </div>
        <div className='error-message'>{errorMessage}</div>
      </div>
    </Modal>
  );
}
