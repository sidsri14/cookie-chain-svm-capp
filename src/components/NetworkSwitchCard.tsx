import { useEffect, useState } from 'react';
import { COOKIE_GENESIS_HASH } from '../lib/cookie-chain';
import { isNightlyInstalled, switchNightlyToCookieChain } from '../lib/nightly';
import { fetchChainStatus } from '../lib/memo-feed';
import { getWalletErrorMessage } from '../lib/tx-errors';
import { formatSlot } from '../lib/format';

type SwitchStatus = 'idle' | 'switching' | 'ok' | 'error';

/** Shows live chain state + a one-click Nightly wallet network switch to Cookie Chain. */
export function NetworkSwitchCard() {
  const [slot, setSlot] = useState<number | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [status, setStatus] = useState<SwitchStatus>('idle');
  const [error, setError] = useState('');
  const installed = isNightlyInstalled();

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const tick = async () => {
      try {
        const state = await fetchChainStatus();
        if (cancelled) return;
        setSlot(state.slot);
        setGenesisHash(state.genesisHash);
      } catch {
        // RPC hiccup — keep last known values.
      }
    };
    void tick();
    timer = window.setInterval(() => void tick(), 4000);
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const onNetworkSwitch = async () => {
    setStatus('switching');
    setError('');
    try {
      await switchNightlyToCookieChain();
      setStatus('ok');
    } catch (e) {
      setStatus('error');
      setError(getWalletErrorMessage(e));
    }
  };

  const onCorrectGenesis = genesisHash === COOKIE_GENESIS_HASH;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">Chain status</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              <span className="font-mono text-zinc-300">{slot !== null ? formatSlot(slot) : '—'}</span>
              <span className="text-zinc-500">slot</span>
            </span>
            <span className="text-zinc-400">
              RPC <code className="font-mono text-zinc-300">rpc.cookiescan.io</code>
            </span>
            <span
              className="font-mono text-[11px]"
              title={genesisHash ?? undefined}
            >
              {onCorrectGenesis ? (
                <span className="text-emerald-400">genesis ✓ Cookie Chain</span>
              ) : (
                <span className="text-zinc-500">{genesisHash ? `${genesisHash.slice(0, 12)}…` : 'genesis…'}</span>
              )}
            </span>
          </div>
        </div>

        <div className="text-right">
          {installed ? (
            status === 'ok' ? (
              <span className="text-sm text-emerald-400">Wallet switched to Cookie Chain ✓</span>
            ) : (
              <button
                type="button"
                onClick={() => void onNetworkSwitch()}
                disabled={status === 'switching'}
                className="rounded-xl bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white disabled:opacity-60"
              >
                {status === 'switching' ? 'Switching…' : 'Switch Nightly → Cookie Chain'}
              </button>
            )
          ) : (
            <p className="text-xs text-zinc-500">
              Install <span className="text-zinc-300">Nightly</span> to sign Cookie Chain txs.
            </p>
          )}
          {status === 'error' && <p className="mt-1 max-w-60 text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  );
}
