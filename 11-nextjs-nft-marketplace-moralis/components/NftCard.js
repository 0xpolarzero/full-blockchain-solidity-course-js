import marketplaceAbi from '../constants/NftMarketplace.json';
import nftAbi from '../constants/BasicNft.json';
import Image from 'next/image';
import UpdateListingModal from './UpdateListingModal';
import BuyingModal from './BuyingModal';
import { readFromContract } from '../systems/interactWithContract';
import { roundEth, truncateAddress } from '../utils/formatting';
import { Skeleton } from 'antd';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

export default function NftCard({ nftAttributes }) {
  const { marketplaceAddress, nftAddress, tokenId, price, seller } =
    nftAttributes;
  const { address: userAddress } = useAccount();
  const [isURILoaded, setIsURILoaded] = useState(false);
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isUpdateListingModalOpen, setIsUpdateListingModalOpen] =
    useState(false);
  const [isBuyingModalOpen, setIsBuyingModalOpen] = useState(false);

  const tokenURI = readFromContract(nftAddress, nftAbi, 'tokenURI', [tokenId]);
  async function updateUI() {
    if (tokenURI) {
      let tokenData = {};

      // We need an IPFS Gateway, to transform an IPFS file to a usual URL
      const requestUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const tokenURIResponse = await fetch(requestUrl);

      // Handle fetching if the user makes too many requests
      // e.g. refresh the page or change accounts too many times
      if (tokenURIResponse.status === 429) {
        console.log('Too many requests');
        tokenData.uri = '';
        tokenData.name = '';
        tokenData.description = '';
        setIsURILoaded(false);

        // Call the function again after a few seconds
        setTimeout(() => {
          updateUI();
        }, 5000);
      } else {
        const tokenURIResponseJson = await tokenURIResponse.json();
        // Now that it is fetched, we do it again for the front end
        tokenData.uri = tokenURIResponseJson.image.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/',
        );
        tokenData.name = tokenURIResponseJson.name;
        tokenData.description = tokenURIResponseJson.description;
        setIsURILoaded(true);
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
    // Cancel the modal if the user changes accounts
    setIsUpdateListingModalOpen(false);
    setIsBuyingModalOpen(false);
  }, [userAddress]);

  return (
    <div
      className={'nft-card'}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={() => (isUserSeller ? showModal('update') : showModal('buy'))}
    >
      <UpdateListingModal
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
        {/* We're using the <Image> tag that does some optimization for us */}
        {/* But since it's using a server, it's no longer a static website */}
        {imageURI ? (
          <Image
            src={imageURI}
            loader={() => imageURI}
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
        {/* NFT Address: {nftAddress} */}
        <div className='price'>
          <i className='fa-brands fa-ethereum'></i>
          {roundEth(price)}
        </div>
        <div className='seller'>
          {isUserSeller ? 'You' : truncateAddress(seller)}
        </div>
        {/* Seller: {seller} */}
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
              Buy (<i className='fa-brands fa-ethereum'></i> {roundEth(price)})
            </div>
            <i className='fa-solid fa-cart-shopping'></i>
          </div>
        )}
      </div>
    </div>
  );
}
