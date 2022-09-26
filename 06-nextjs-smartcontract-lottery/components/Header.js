import { ConnectButton } from 'web3uikit';

const Header = () => {
  //

  return (
    <header className='header'>
      <h1 className='title'>Decentralized Raffle</h1>
      <ConnectButton className='connect-btn' moralisAuth={false} />
    </header>
  );
};

export default Header;
