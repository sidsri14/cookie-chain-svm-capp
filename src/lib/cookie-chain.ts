import { PublicKey } from '@solana/web3.js';

/** Public Cookie Chain SVM RPC (Solana JSON-RPC). */
export const COOKIE_RPC_URL = 'https://rpc.cookiescan.io';
/** CookieScan block explorer root. */
export const COOKIE_EXPLORER_URL = 'https://cookiescan.io';
/** Cookie Chain genesis blockhash — used to target the Nightly wallet network. */
export const COOKIE_GENESIS_HASH = '9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2';
/** Native COOK has the same 9-decimal unit as lamports. */
export const COOK_DECIMALS = 9;
/** Base fee for a one-instruction (Memo) transaction, in lamports. Verified via getFeeForMessage. */
export const COOK_FEE_LAMPORTS = 5_000;
/** Official community channel where new wallets can be sent a little COOK to cover gas. */
export const COOK_TELEGRAM_URL = 'https://t.me/TheCookieNetChain';
/** Official Hyperlane warp bridge to move COOK from Solana to Cookie Chain. */
export const COOK_BRIDGE_URL = 'https://hyperlane.cookiescan.io';

/**
 * The Solana Memo program is deployed at genesis on Cookie Chain, so any wallet can
 * write an on-chain memo with a single signed transaction — no contract deployment.
 */
export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
export const MEMO_PROGRAM_ID_STRING = MEMO_PROGRAM_ID.toBase58();

export function explorerTxUrl(signature: string): string {
  return `${COOKIE_EXPLORER_URL}/tx/${signature}`;
}

export function explorerAddressUrl(address: string): string {
  return `${COOKIE_EXPLORER_URL}/address/${address}`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
