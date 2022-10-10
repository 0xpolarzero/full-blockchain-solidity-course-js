import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import NftCard from '../components/NftCard';
import SellingModal from '../components/SellingModal';
import ProceedsModal from '../components/ProceedsModal';
import { Radio } from 'antd';
import { useAccount } from 'wagmi';
import { useMoralisQuery } from 'react-moralis';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isDisconnected, address: userAddress } = useAccount();
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    'ActiveItem',
    (query) => query.limit(10).descending('tokenId'),
  );
  const [shownNfts, setShownNfts] = useState('');
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [isProceedsModalOpen, setIsProceedsModalOpen] = useState(false);

  function handleChange(e) {
    if (e.target.value === 'a') {
      setShownNfts(listedNfts);
    } else {
      setShownNfts(
        listedNfts.filter(
          (nft) =>
            nft.attributes.seller.toLowerCase() === userAddress.toLowerCase(),
        ),
      );
    }
  }

  useEffect(() => {
    setShownNfts(listedNfts);
  }, [listedNfts]);

  return (
    <div>
      <header className={styles.header}>
        <Header />
      </header>

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
              {!isDisconnected &&
              !fetchingListedNfts &&
              !(listedNfts.length === 0) ? (
                <div className='action-filters'>
                  <div className='title'>
                    <div>Filters</div>
                    <i className='fa-solid fa-filter'></i>
                  </div>
                  <Radio.Group
                    className='filter-group'
                    onChange={handleChange}
                    defaultValue='a'
                    buttonStyle='solid'
                  >
                    <Radio.Button className='filter-btn' value='a'>
                      All
                    </Radio.Button>
                    <Radio.Button className='filter-btn' value='b'>
                      Your listings
                    </Radio.Button>
                  </Radio.Group>
                </div>
              ) : (
                <div></div>
              )}

              <div className='home-actions-btns'>
                <button
                  className='mint-btn action-withdraw'
                  onClick={() => setIsProceedsModalOpen(true)}
                >
                  Proceeds
                </button>

                <button
                  className='mint-btn action-sell'
                  onClick={() => setIsSellingModalOpen(true)}
                >
                  Sell
                </button>
              </div>
            </div>
            {!isDisconnected ? (
              fetchingListedNfts ? (
                <div className='loader'></div>
              ) : listedNfts.length === 0 ? (
                <div className='box-container error'>
                  No NFT listed on the marketplace yet.
                </div>
              ) : (
                <div className='home-nft'>
                  {shownNfts.map((nft) => {
                    return (
                      <NftCard
                        key={`${nft.attributes.nftAddress}${nft.attributes.tokenId}`}
                        nftAttributes={nft.attributes}
                      />
                    );
                  })}
                </div>
              )
            ) : (
              <div className='error not-connected'>
                You must connect your wallet to see recently listed NFTs.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
