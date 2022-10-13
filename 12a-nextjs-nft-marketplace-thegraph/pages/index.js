import styles from '../styles/Home.module.css';
import NftCard from '../components/NftCard';
import SellingModal from '../components/SellingModal';
import ProceedsModal from '../components/ProceedsModal';
import networkMapping from '../constants/networkMapping';
import {
  GET_ACTIVE_ITEMS_GOERLI,
  GET_ACTIVE_ITEMS_MUMBAI,
  GET_ACTIVE_ITEMS_ARBITRUM_GOERLI,
} from '../constants/subgraphQueries';
import { Button, Radio } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { useAccount, useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isDisconnected, address: userAddress } = useAccount();
  const { network } = useProvider();
  const [isItemsFiltered, setIsItemsFiltered] = useState(false);
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [isProceedsModalOpen, setIsProceedsModalOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [activeItems, setActiveItems] = useState([]);
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const chainId = network.chainId ? network.chainId.toString() : '31337';

  const [getGoerliData, { data: goerliData, refetch: refetchGoerliData }] =
    useLazyQuery(GET_ACTIVE_ITEMS_GOERLI);
  const [getMumbaiData, { data: mumbaiData, refetch: refetchMumbaiData }] =
    useLazyQuery(GET_ACTIVE_ITEMS_MUMBAI);
  const [
    getArbitrumGoerliData,
    { data: arbitrumGoerliData, refetch: refetchArbitrumGoerliData },
  ] = useLazyQuery(GET_ACTIVE_ITEMS_ARBITRUM_GOERLI);

  function handleChange(e) {
    if (e.target.value === 'all') {
      setIsItemsFiltered(false);
    } else {
      setIsItemsFiltered(true);
    }
  }

  useEffect(() => {
    if (networkMapping[chainId]) {
      setMarketplaceAddress(networkMapping[chainId]['NftMarketplace'][0]);
    }

    if (network.name === 'goerli') {
      refetchGoerliData();
      goerliData && setActiveItems(goerliData.activeItems);
      setIsWrongNetwork(false);
    } else if (network.name === 'maticmum') {
      refetchMumbaiData();
      mumbaiData && setActiveItems(mumbaiData.activeItems);
      setIsWrongNetwork(false);
    } else if (network.name === 'arbitrum-goerli') {
      refetchArbitrumGoerliData();
      arbitrumGoerliData && setActiveItems(arbitrumGoerliData.activeItems);
      setIsWrongNetwork(false);
    } else {
      setIsWrongNetwork(true);
    }
  }, [network.chainId, goerliData, mumbaiData, arbitrumGoerliData]);

  return (
    <main className={styles.main}>
      <div className='content'>
        <div className='home-container'>
          <SellingModal
            isVisible={isSellingModalOpen}
            hideModal={() => setIsSellingModalOpen(false)}
          />
          <ProceedsModal
            isVisible={isProceedsModalOpen}
            hideModal={setIsProceedsModalOpen}
          />

          <div className='home-actions'>
            {!isDisconnected ? (
              activeItems && activeItems?.length === 0 ? (
                <div></div>
              ) : (
                <div className='action-filters'>
                  <div className='title'>
                    <div>Filters</div>
                    <i className='fa-solid fa-filter'></i>
                  </div>
                  <Radio.Group
                    className='filter-group'
                    onChange={handleChange}
                    defaultValue='all'
                    buttonStyle='solid'
                    disabled={isWrongNetwork}
                  >
                    <Radio.Button className='filter-btn' value='all'>
                      All
                    </Radio.Button>
                    <Radio.Button className='filter-btn' value='owned'>
                      Your listings
                    </Radio.Button>
                  </Radio.Group>
                </div>
              )
            ) : (
              <div></div>
            )}

            <div className='home-actions-btns'>
              <Button
                type='primary'
                className='mint-btn action-withdraw'
                onClick={() => setIsProceedsModalOpen(true)}
                disabled={isWrongNetwork}
              >
                Proceeds
              </Button>

              <Button
                type='primary'
                className='mint-btn action-sell'
                onClick={() => setIsSellingModalOpen(true)}
                disabled={isWrongNetwork}
              >
                Sell
              </Button>
            </div>
          </div>
          {!isDisconnected ? (
            !isWrongNetwork ? (
              activeItems && activeItems?.length === 0 ? (
                <div className='box-container error'>
                  No NFT listed on the marketplace yet.
                </div>
              ) : (
                <div className='home-nft'>
                  {activeItems &&
                    activeItems
                      .filter((nft) => {
                        return !isItemsFiltered || nft.seller === userAddress;
                      })
                      .map((nft) => {
                        return (
                          <NftCard
                            key={`${nft.nftAddress}${nft.tokenId}`}
                            nftAttributes={nft}
                            marketplaceAddress={marketplaceAddress}
                          />
                        );
                      })}
                </div>
              )
            ) : (
              <div className='box-container error'>
                You are on an unsupported network. Please change to Goerli or
                Mumbai.
              </div>
            )
          ) : (
            <div className='box-container error'>
              You must connect your wallet to see recently listed NFTs.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
