import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

const Header = () => {
  const {
    Moralis,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    deactivateWeb3,
    account,
  } = useMoralis();

  async function connect() {
    enableWeb3();
    typeof window !== 'undefined' &&
      window.localStorage.setItem('connected', 'injected');
  }

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('connected')
    ) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account === null) {
        window.localStorage.removeItem('connected');
        deactivateWeb3();
        console.log('No account found.');
      }
    });
  }, [account]);

  return (
    <header className='header'>
      <div className='title'>Title</div>
      {account ? (
        <div>
          {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
      ) : (
        <button onClick={connect} disabled={isWeb3EnableLoading}>
          Connect Wallet
        </button>
      )}
    </header>
  );
};

export default Header;
