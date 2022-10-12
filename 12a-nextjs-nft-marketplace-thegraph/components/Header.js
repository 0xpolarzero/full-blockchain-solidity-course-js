import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
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
        <ConnectButton
          showBalance={false}
          showNe
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'avatar',
          }}
          chainStatus={{
            smallScreen: 'icon',
            largeScreen: 'full',
          }}
        />
      </div>
    </nav>
  );
}
