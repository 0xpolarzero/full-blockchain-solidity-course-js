import marketplaceAbi from '../constants/NftMarketplace.json';
import nftAbi from '../constants/BasicNft.json';
import Image from 'next/image';
import UpdateListingModal from './UpdateListingModal';
import BuyingModal from './BuyingModal';
import { readFromContract } from '../systems/interactWithContract';
import { roundEth, truncateAddress } from '../utils/formatting';
import { Skeleton } from 'antd';
import { CryptoIcon } from 'next-crypto-icons';
import { useAccount, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function NftCard({ nftAttributes, marketplaceAddress }) {
  const { nftAddress, tokenId, price, seller } = nftAttributes;
  const { address: userAddress } = useAccount();
  const { network } = useProvider();
  const [isURILoaded, setIsURILoaded] = useState(false);
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isUpdateListingModalOpen, setIsUpdateListingModalOpen] =
    useState(false);
  const [isBuyingModalOpen, setIsBuyingModalOpen] = useState(false);

  const tokenURI = readFromContract(
    nftAddress,
    nftAbi,
    'tokenURI',
    [tokenId],
    tokenId,
  );
  async function updateUI() {
    if (tokenURI) {
      let tokenData = {};

      // We need an IPFS Gateway, to transform an IPFS file to a usual URL
      const requestUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const tokenURIResponse = await fetch(requestUrl).catch((err) => {
        console.log(err);
      });

      // Handle fetching if the user makes too many requests
      // e.g. refresh the page or change accounts too many times
      if (tokenURIResponse && tokenURIResponse.status === 429) {
        console.log('Too many requests');
        tokenData.uri = '';
        tokenData.name = '';
        tokenData.description = '';
        setIsURILoaded(false);

        // Call the function again after a few seconds
        setTimeout(() => {
          updateUI();
        }, 5000);
      } else if (tokenURIResponse) {
        const tokenURIResponseJson = await tokenURIResponse.json();
        // Now that it is fetched, we do it again for the front end
        tokenData.uri = tokenURIResponseJson.image.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/',
        );
        tokenData.name = tokenURIResponseJson.name;
        tokenData.description = tokenURIResponseJson.description;
        setIsURILoaded(true);
      } else {
        tokenData.uri = '';
        tokenData.name = '';
        tokenData.description = '';
        setIsURILoaded(false);
        toast.error('Error fetching NFT data. Please refresh.');
      }

      setImageURI(tokenData.uri);
      setTokenName(tokenData.name);
      setTokenDescription(tokenData.description);
    }

    setIsUserSeller(
      userAddress.toLowerCase() === seller.toLowerCase() ||
        seller === undefined,
    );
  }

  function showModal(type) {
    if (type === 'update') {
      setIsUpdateListingModalOpen(true);
    } else if (type === 'buy') {
      setIsBuyingModalOpen(true);
    }
  }

  useEffect(() => {
    if (userAddress) {
      updateUI();
    }
    // Cancel the modal if the user changes accounts or network
    setIsUpdateListingModalOpen(false);
    setIsBuyingModalOpen(false);
  }, [userAddress, network.name]);

  return (
    <div
      className={'nft-card'}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={() => (isUserSeller ? showModal('update') : showModal('buy'))}
    >
      <UpdateListingModal
        key={'update-listing-modal'}
        props={{
          marketplaceAddress,
          marketplaceAbi,
          nftAddress,
          tokenName,
          tokenId,
          price,
        }}
        isVisible={isUpdateListingModalOpen}
        hideModal={() => setIsUpdateListingModalOpen(false)}
      />

      <BuyingModal
        key={'buying-modal'}
        props={{
          marketplaceAddress,
          marketplaceAbi,
          nftAddress,
          tokenName,
          tokenId,
          price,
        }}
        isVisible={isBuyingModalOpen}
        hideModal={() => setIsBuyingModalOpen(false)}
      />

      <div className='image'>
        {imageURI ? (
          <Image
            src={imageURI}
            loader={() => imageURI}
            unoptimized
            width={300}
            height={300}
          />
        ) : (
          <Skeleton.Image
            style={{ width: 300, height: 300 }}
            loading={!isURILoaded}
            active
            className='nft-skeleton'
          />
        )}
      </div>
      <div className='properties'>
        <div className='name'>
          {tokenName} <span className='token-id'>#{tokenId}</span>
        </div>

        <div className='description'>{tokenDescription}</div>
        <Skeleton paragraph={{ rows: 1 }} loading={!isURILoaded} active />
      </div>
      <div className='info'>
        <div className='price'>
          {network.name === 'maticmum' ? (
            <CryptoIcon name='matic' width={20} style={'color'} />
          ) : (
            <i className='fa-brands fa-ethereum'></i>
          )}
          {roundEth(price)}
        </div>
        <div className='seller'>
          {isUserSeller ? 'You' : truncateAddress(seller)}
        </div>
      </div>

      <div className='actions'>
        {isUserSeller ? (
          <div className='action-edit-item'>
            <div>Update</div>
            <i className='fa-solid fa-pen'></i>
          </div>
        ) : (
          <div className='action-buy-item'>
            <div>
              Buy{' '}
              {network.name === 'maticmum' ? (
                <CryptoIcon name='matic' width={20} style={'color'} />
              ) : (
                <i className='fa-brands fa-ethereum'></i>
              )}
              {roundEth(price)}
            </div>
            <i className='fa-solid fa-cart-shopping'></i>
          </div>
        )}
      </div>
    </div>
  );
}
