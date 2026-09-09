/** A memo decoded from the Cookie Chain memo-program history. */
export interface MemoPost {
  /** Transaction signature of the memo tx. */
  signature: string;
  /** Slot the tx landed in. */
  slot: number;
  /** Signer wallet that posted the memo. */
  signer: string;
  /** Decoded memo text. */
  memo: string;
  /** tx blockTime in ms (0 if the RPC omitted it). */
  timestampMs: number;
}

/** Human-visible states for a memo being posted. */
export type PostStatus = 'idle' | 'pending' | 'confirmed' | 'error';
