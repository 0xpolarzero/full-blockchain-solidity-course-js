import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <ConnectButton
      showBalance={true}
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  );
}
