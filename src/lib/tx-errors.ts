import { COOK_BRIDGE_URL, COOK_TELEGRAM_URL } from './cookie-chain';

/** Turn a thrown wallet/RPC error into a short, human-readable message. */
export function getWalletErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Try again.';
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : String(error);
  const lower = message.toLowerCase();

  if (/(user rejected|rejected the request|denied|declined|user canceled)/.test(lower)) {
    return 'Transaction was rejected in your wallet.';
  }
  // AccountNotFound (RPC code -32002): the fee-payer has never been funded on Cookie
  // Chain, so no on-chain account exists to debit the fee from. Nightly surfaces this
  // as "account not found". This is the #1 "can't post" cause for brand-new wallets.
  if (
    /(account.?not.?found|account.?not.?exist|accountnotfound|no record of a prior credit|attempt to debit|0x1)/.test(
      lower,
    )
  ) {
    return `Your wallet has no COOK on Cookie Chain yet, so there's no funded account to pay the posting fee. Cookie Chain has no faucet — get a little COOK from the official Telegram (${COOK_TELEGRAM_URL}) or bridge it from Solana (${COOK_BRIDGE_URL}), then post again.`;
  }
  if (/(insufficient|0x1770)/.test(lower)) {
    return 'Insufficient native COOK balance to pay the transaction fee.';
  }
  if (/(blockhash.*expir|too old|expired blockhash)/.test(lower)) {
    return 'Transaction expired before it was confirmed. Try again.';
  }
  if (/(failed to fetch|network error|timeout|fetch failed|connection reset)/.test(lower)) {
    return 'Network error reaching the Cookie Chain RPC. Check your connection and retry.';
  }
  if (/(wallet not connected|no wallet|connect your wallet)/.test(lower)) {
    return 'No wallet connected. Connect a wallet first.';
  }
  return message;
}
