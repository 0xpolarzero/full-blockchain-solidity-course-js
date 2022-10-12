import styles from '../styles/Home.module.css';
import NftCard from '../components/NftCard';
import SellingModal from '../components/SellingModal';
import ProceedsModal from '../components/ProceedsModal';
import networkMapping from '../constants/networkMapping';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import { Button, Radio } from 'antd';
import { createClient } from 'urql';
import { useAccount, useProvider } from 'wagmi';
// import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const clientGoerli = createClient({
  url: process.env.NEXT_PUBLIC_SUBGRAPH_URL_GOERLI,
  requestPolicy: 'network-only',
});

const clientMumbai = createClient({
  url: process.env.NEXT_PUBLIC_SUBGRAPH_URL_MUMBAI,
});

const clientArbitrumGoerli = createClient({
  url: process.env.NEXT_PUBLIC_SUBGRAPH_URL_ARBITRUM_GOERLI,
});

export default function Home() {
  const { isDisconnected, address: userAddress } = useAccount();
  const { network } = useProvider();
  const [isItemsFiltered, setIsItemsFiltered] = useState(false);
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [isProceedsModalOpen, setIsProceedsModalOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const [activeClient, setActiveClient] = useState(clientGoerli);
  const [activeItems, setActiveItems] = useState({});
  const [isActiveItemsLoading, setIsActiveItemsLoading] = useState(true);
  const chainId = network.chainId ? network.chainId.toString() : '31337';

  async function fetchListedNfts() {
    const data = await activeClient.query(GET_ACTIVE_ITEMS).toPromise();
    setActiveItems({
      data: data.data.activeItems,
      isError: data.error,
    });
    setIsActiveItemsLoading(false);
  }

  function updateClient(network) {
    if (network === 'maticmum') {
      setActiveClient(clientMumbai);
    } else if (network === 'arbitrum-goerli') {
      setActiveClient(clientArbitrumGoerli);
    } else {
      setActiveClient(clientGoerli);
    }
  }

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

    updateClient(network.name);
  }, [network.chainId]);

  useEffect(() => {
    fetchListedNfts();

    const interval = setInterval(() => {
      console.log(activeItems);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      {/* {!isDisconnected ? (
        isListedNftsLoading || !listedNfts ? (
          <div>Loading...</div>
        ) : (
          listedNfts.activeItems
            // .filter((nft) => {
            //   return !isItemsFiltered || nft.seller === userAddress;
            // })
            .map((nft) => {
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
      )} */}
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
              isActiveItemsLoading || activeItems.isError ? (
                ''
              ) : activeItems && activeItems.data.length === 0 ? (
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
              isActiveItemsLoading ? (
                <div className='loader'></div>
              ) : activeItems && activeItems.data.length === 0 ? (
                <div className='box-container error'>
                  No NFT listed on the marketplace yet.
                </div>
              ) : (
                <div className='home-nft'>
                  {activeItems &&
                    activeItems.data
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
