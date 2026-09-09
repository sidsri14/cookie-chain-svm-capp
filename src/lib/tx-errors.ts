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
  if (/(insufficient|attempt to debit|0x1|0x1770)/.test(lower)) {
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
