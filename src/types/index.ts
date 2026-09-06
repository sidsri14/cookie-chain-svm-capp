export interface CookieToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  progressPercent: number; // Bonding curve progress
  holders: number;
  creator: string;
  txHash: string;
  description: string;
}

export interface CookieScanBlock {
  slot: number;
  tps: number;
  blockTimeMs: number;
  txCount: number;
  feePerTxUsd: number;
}
