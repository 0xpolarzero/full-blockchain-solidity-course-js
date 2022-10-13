import styles from '../styles/Home.module.css';
import NftCard from '../components/NftCard';
import SellingModal from '../components/SellingModal';
import ProceedsModal from '../components/ProceedsModal';
import networkMapping from '../constants/networkMapping';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import { Button, Radio } from 'antd';
import { useAccount, useProvider } from 'wagmi';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';

export default function Home({ activeItems }) {
  console.log(activeItems);
  const { isDisconnected, address: userAddress } = useAccount();
  const { network } = useProvider();
  const [isItemsFiltered, setIsItemsFiltered] = useState(false);
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [isProceedsModalOpen, setIsProceedsModalOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [activeItemsForNetwork, setActiveItemsForNetwork] = useState([]);
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const chainId = network.chainId ? network.chainId.toString() : '31337';

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

    if (!!activeItems) {
      if (network.name === 'maticmum') {
        setActiveItemsForNetwork(activeItems.mumbai);
      } else if (network.name === 'arbitrum-goerli') {
        setActiveItemsForNetwork(activeItems.arbitrumGoerli);
      } else {
        setActiveItemsForNetwork(activeItems.goerli);
      }
    }
  }, [network.chainId, activeItems]);

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
              activeItemsForNetwork && activeItemsForNetwork?.length === 0 ? (
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
              activeItemsForNetwork && activeItemsForNetwork?.length === 0 ? (
                <div className='box-container error'>
                  No NFT listed on the marketplace yet.
                </div>
              ) : (
                <div className='home-nft'>
                  {activeItemsForNetwork &&
                    activeItemsForNetwork
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

const apolloClientGoerli = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL_GOERLI,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

// const apolloClientMumbai = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL_MUMBAI,
//   defaultOptions: {
//     query: {
//       fetchPolicy: 'no-cache',
//       errorPolicy: 'all',
//     },
//   },
// });

// const apolloClientArbitrumGoerli = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL_ARBITRUM_GOERLI,
//   defaultOptions: {
//     query: {
//       fetchPolicy: 'no-cache',
//       errorPolicy: 'all',
//     },
//   },
// });

export async function getStaticProps() {
  // const [activeClient, setActiveClient] = useState(apolloClientGoerli);
  // const { network } = useProvider();

  // function updateClient(network) {
  //   if (network === 'maticmum') {
  //     setActiveClient(apolloClientMumbai);
  //   } else if (network === 'arbitrum-goerli') {
  //     setActiveClient(apolloClientArbitrumGoerli);
  //   } else {
  //     setActiveClient(apolloClientGoerli);
  //   }
  // }

  // useEffect(() => {
  //   network && updateClient(network.name);
  // }, [network]);

  const { data: goerliData } = await apolloClientGoerli.query({
    query: GET_ACTIVE_ITEMS,
  });

  const { data: mumbaiData } = await apolloClientGoerli.query({
    query: GET_ACTIVE_ITEMS,
  });

  const { data: arbitrumGoerliData } = await apolloClientGoerli.query({
    query: GET_ACTIVE_ITEMS,
  });

  return {
    props: {
      activeItems: {
        goerli: goerliData.activeItems,
        mumbai: mumbaiData.activeItems,
        arbitrumGoerli: arbitrumGoerliData.activeItems,
      },
    },
  };
}
