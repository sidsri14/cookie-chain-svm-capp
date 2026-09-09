import { useEffect, useMemo, type ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { NightlyWalletAdapter } from '@solana/wallet-adapter-nightly';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { COOKIE_RPC_URL } from '../lib/cookie-chain';
import '@solana/wallet-adapter-react-ui/styles.css';

const COOKIE_MODAL_TITLE = 'Connect a wallet on Cookie Chain';

/** The modal header says "Select Wallet" / "Solana" by default — retitle it for Cookie Chain. */
function WalletModalTitleFix() {
  useEffect(() => {
    const fix = () => {
      const title = document.querySelector('.wallet-adapter-modal-title') as HTMLElement | null;
      if (title && title.textContent !== COOKIE_MODAL_TITLE) title.textContent = COOKIE_MODAL_TITLE;
    };
    fix();
    const observer = new MutationObserver(fix);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}

export function CookieWalletProvider({ children }: { children: ReactNode }) {
  // Cookie Chain is Solana-compatible, so the standard adapters work once pointed at
  // its RPC + genesis hash (see the in-app Nightly network switch).
  const wallets = useMemo(
    () => [
      new NightlyWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={COOKIE_RPC_URL} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletModalTitleFix />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
