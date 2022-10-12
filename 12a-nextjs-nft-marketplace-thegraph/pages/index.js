import styles from '../styles/Home.module.css';
import NftCard from '../components/NftCard';
import SellingModal from '../components/SellingModal';
import ProceedsModal from '../components/ProceedsModal';
import networkMapping from '../constants/networkMapping';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import { Button, Radio } from 'antd';
import { useAccount, useProvider } from 'wagmi';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

export default function Home({ updateApolloClient }) {
  const { isDisconnected, address: userAddress } = useAccount();
  const { network } = useProvider();
  const [isItemsFiltered, setIsItemsFiltered] = useState(false);
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [isProceedsModalOpen, setIsProceedsModalOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const chainId = network.chainId ? network.chainId.toString() : '31337';

  const {
    loading: fetchingListedNfts,
    error,
    data: listedNfts,
    networkStatus,
  } = useQuery(GET_ACTIVE_ITEMS, {
    fetchPolicy: 'no-cache',
  });

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

    if (
      network.name === 'goerli' ||
      network.name === 'maticmum' ||
      network.name === 'arbitrum-goerli'
    ) {
      setIsWrongNetwork(false);
    } else {
      setIsWrongNetwork(true);
    }

    // updateApolloClient(network.name);
  }, [network.chainId]);

  return (
    <main className={styles.main}>
      {!isDisconnected ? (
        fetchingListedNfts || !listedNfts ? (
          <div>Loading...</div>
        ) : (
          listedNfts.activeItems
            // .filter((nft) => {
            //   return !isItemsFiltered || nft.seller === userAddress;
            // })
            .map((nft) => {
              console.log(listedNfts);
              return (
                <NftCard
                  key={`${nft.nftAddress}${nft.tokenId}`}
                  nftAttributes={nft}
                  marketplaceAddress={marketplaceAddress}
                />
              );
            })
        )
      ) : (
        <div>Please connect</div>
      )}
      {/* <div className='content'>
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
              fetchingListedNfts ? (
                ''
              ) : listedNfts && listedNfts.activeItems.length === 0 ? (
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
              fetchingListedNfts ? (
                <div className='loader'></div>
              ) : listedNfts && listedNfts.activeItems.length === 0 ? (
                <div className='box-container error'>
                  No NFT listed on the marketplace yet.
                </div>
              ) : (
                <div className='home-nft'>
                  {listedNfts &&
                    listedNfts.activeItems
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
      </div> */}
    </main>
  );
}
