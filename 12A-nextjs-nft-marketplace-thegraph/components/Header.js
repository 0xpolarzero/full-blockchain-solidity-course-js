import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';

export default function Header() {
  const { chain } = useNetwork();
  const [currentChain, setCurrentChain] = useState('');
  useEffect(() => {
    chain && setCurrentChain(chain.name);
  }, [chain]);

  return (
    <nav>
      <div className='title'>
        <Link href='/'>
          <a className='title'>NFT Marketplace</a>
        </Link>
      </div>
      <div className='links'>
        <Link href='/'>
          <button className='nav-btn'>Home</button>
        </Link>
        <Link href='/mint-nft'>
          <button className='nav-btn'>
            <span className='highlight bold'>Mint</span>
          </button>
        </Link>
      </div>
      <div className='connect-btn'>
        {/* <div className={`chain ${currentChain}`}>{currentChain}</div> */}
        <ConnectButton
          showBalance={false}
          showNe
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'avatar',
          }}
          chainStatus={{
            smallScreen: 'icon',
            largeScreen: 'icon',
          }}
        />
      </div>
    </nav>
  );
}
