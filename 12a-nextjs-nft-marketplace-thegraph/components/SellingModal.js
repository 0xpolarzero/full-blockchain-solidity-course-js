import marketplaceAbi from '../constants/NftMarketplace.json';
import nftAbi from '../constants/BasicNft.json';
import networkMapping from '../constants/networkMapping';
import { writeToContract } from '../systems/interactWithContract';
import { Modal, Input, InputNumber, Tooltip, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CryptoIcon } from 'next-crypto-icons';
import { BsHash } from 'react-icons/bs';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function SellingModal({ isVisible, hideModal }) {
  const { network } = useProvider();
  const [marketplaceAddress, setMarketplaceAddress] = useState(null);
  const [nftAddress, setNftAddress] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isItemApproved, setIsItemApproved] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [formattedPrice, setFormattedPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { write: approveMarketplace, isLoading: isApproveLoading } =
    writeToContract(
      nftAddress,
      nftAbi,
      'approve',
      [marketplaceAddress, tokenId],
      { onSuccess: handleApproveSuccess, onError: handleError },
      isVisible && marketplaceAddress && tokenId !== '',
    );

  const {
    write: listItem,
    isLoading: isListItemLoading,
    refetch: rePrepareListing,
  } = writeToContract(
    marketplaceAddress,
    marketplaceAbi,
    'listItem',
    [nftAddress, tokenId, formattedPrice],
    { onSuccess: handleListingSuccess, onError: handleError },
    nftAddress && tokenId !== '' && formattedPrice,
  );

  function copyNftAddress() {
    navigator.clipboard.writeText(nftAddress);
    toast.info('NFT Contract address copied to clipboard!');
  }

  async function handleSubmit(e, type) {
    if (type === 'approveMarketplace' && !approveMarketplace) {
      toast.error('Please check if you own this NFT');
      return;
    }

    if (type === 'listItem' && !listItem) {
      toast.error(
        'It looks like you have not approved the marketplace yet. Please wait for the approval to go through.',
      );
      return;
    }

    if (type === 'approveMarketplace') approveMarketplace();
    if (type === 'listItem') listItem();
    setIsWalletOpen(true);
    e && e.stopPropagation();
  }

  async function handleApproveSuccess(tx) {
    const txReceipt = await toast.promise(tx.wait(1), {
      pending: 'Approving marketplace...',
      success: 'Item approved for marketplace. You can now list it.',
      error: 'Error approving marketplace.',
    });
    rePrepareListing();
    setIsItemApproved(true);
    setIsWalletOpen(false);
  }

  async function handleListingSuccess(tx) {
    console.log('here');
    const txReceipt = await toast.promise(tx.wait(1), {
      pending: 'Listing item...',
      success: 'Item listed!',
      error: 'Error listing item.',
    });
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
    setIsItemApproved(false);
    setTokenId('');
    setPrice('');
    e && e.stopPropagation();
  }

  async function handleChange(value, type) {
    if (value === null) {
      setIsFormValid(false);
    }

    if (type === 'tokenId') {
      setTokenId(value);
    } else if (type === 'price') {
      setPrice(value);

      if (value === null) return; // Don't try to use .toString() on null
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

  useEffect(() => {
    const conditions =
      typeof price !== 'number' ||
      price <= 0 ||
      typeof tokenId !== 'number' ||
      tokenId < 0;

    if (conditions) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }

    if (conditions && price !== '' && tokenId !== '') {
      setErrorMessage('Invalid price or token ID.');
    } else {
      setErrorMessage('');
    }
  }, [price, tokenId]);

  return (
    <Modal
      title='List item'
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      onClose={hideModal}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Cancel
        </Button>,
        <div className='wrap-btn'>
          <Button
            key='approve'
            type='primary'
            disabled={isItemApproved || !isFormValid}
            loading={isApproveLoading || isWalletOpen}
            onClick={(e) => handleSubmit(e, 'approveMarketplace')}
          >
            1 - Approve Marketplace
          </Button>
          <Button
            key='submit'
            type='primary'
            disabled={!isItemApproved}
            loading={isListItemLoading || isWalletOpen}
            onClick={(e) => handleSubmit(e, 'listItem')}
          >
            2 - List Item
          </Button>
        </div>,
      ]}
      okText='List'
    >
      <div className='list-item'>
        <div className='list-address'>
          <label htmlFor='list-address-input'>NFT Address</label>
          <Input
            id='list-address-input'
            type='text'
            value={nftAddress}
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
            prefix={<BsHash />}
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
            prefix={
              network.name === 'maticmum' ? (
                <div className='icon-wrapper'>
                  <CryptoIcon name='matic' width={16} style={'icon'} />
                </div>
              ) : (
                <div className='icon-wrapper'>
                  <CryptoIcon name='eth' width={16} style={'icon'} />
                </div>
              )
            }
            addonAfter={
              <Tooltip
                title={`Enter the price for the NFT (in ${
                  network.name === 'maticmum' ? 'MATIC' : 'ETH'
                })`}
              >
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
