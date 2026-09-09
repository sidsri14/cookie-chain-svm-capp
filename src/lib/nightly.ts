import { COOKIE_GENESIS_HASH, COOKIE_RPC_URL } from './cookie-chain';

/** Minimal shape of the Nightly wallet adapter's in-page provider. */
export interface NightlySolanaProvider {
  changeNetwork?(params: { genesisHash: string; url?: string }): Promise<unknown>;
  connect?(): Promise<unknown>;
  disconnect?(): Promise<unknown>;
}

declare global {
  interface Window {
    nightly?: { solana?: NightlySolanaProvider };
  }
}

/** The Nightly extension exposes itself as `window.nightly.solana`. */
export function getNightlySolana(): NightlySolanaProvider | null {
  if (typeof window === 'undefined') return null;
  return window.nightly?.solana ?? null;
}

/** True only when the actual Nightly browser extension is present. */
export function isNightlyInstalled(): boolean {
  return getNightlySolana() !== null;
}

/**
 * Cookie Chain is a custom SVM, so the Nightly wallet must be pointed at its
 * genesis hash before it can sign Cookie Chain transactions. This is the exact
 * call the Nightly docs expose via `window.nightly.solana.changeNetwork`.
 */
export function switchNightlyToCookieChain(
  genesisHash: string = COOKIE_GENESIS_HASH,
  url: string = COOKIE_RPC_URL,
): Promise<unknown> {
  const nightly = getNightlySolana();
  if (!nightly?.changeNetwork) {
    return Promise.reject(
      new Error('Nightly wallet not detected. Install the Nightly extension, then refresh this page.'),
    );
  }
  return nightly.changeNetwork({ genesisHash, url });
}
