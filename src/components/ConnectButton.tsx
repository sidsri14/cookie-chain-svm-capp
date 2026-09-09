import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { explorerAddressUrl, shortenAddress } from '../lib/cookie-chain';
import { formatCook } from '../lib/format';

export function ConnectButton() {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBalance(null);
    if (connected && publicKey) {
      connection
        .getBalance(publicKey, 'confirmed')
        .then((lamports) => {
          if (!cancelled) setBalance(lamports);
        })
        .catch(() => {
          if (!cancelled) setBalance(null);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [connected, publicKey, connection]);

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    return (
      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-400" title="Connected" />
        <a
          href={explorerAddressUrl(address)}
          target="_blank"
          rel="noreferrer"
          title={`${address} — view on CookieScan`}
          className="font-mono text-amber-300 hover:text-amber-200"
        >
          {shortenAddress(address, 5)}
        </a>
        <span className="text-zinc-400">{formatCook(balance, 4)} COOK</span>
        <button
          type="button"
          onClick={() => {
            void disconnect();
          }}
          className="rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {connecting ? 'Connecting…' : 'Connect wallet'}
    </button>
  );
}
