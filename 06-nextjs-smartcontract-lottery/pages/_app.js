import '../styles/globals.css';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
