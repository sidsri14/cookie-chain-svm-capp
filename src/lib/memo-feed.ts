import { Connection, PublicKey } from '@solana/web3.js';
import {
  COOKIE_RPC_URL,
  MEMO_PROGRAM_ID,
  MEMO_PROGRAM_ID_STRING,
} from './cookie-chain';
import type { MemoPost } from './types';

/** Shared connection to the Cookie Chain RPC. */
export const connection = new Connection(COOKIE_RPC_URL, 'confirmed');

const memoProgramKey = MEMO_PROGRAM_ID;

interface ParsedInstructionLike {
  program?: string;
  programId?: { toBase58(): string } | string;
  parsed?: unknown;
}

/**
 * Extract the memo text from a parsed instruction.
 * With `encoding: jsonParsed`, a Memo-program instruction decodes to
 * `{ program: "spl-memo", programId: MemoSq4…, parsed: "<text>" }`.
 */
function extractMemoText(ix: unknown): string | null {
  if (!ix || typeof ix !== 'object') return null;
  const instr = ix as ParsedInstructionLike;

  // spl-memo decoded by the RPC
  if (instr.program === 'spl-memo') {
    if (typeof instr.parsed === 'string') return instr.parsed;
    const nested = instr.parsed as { parsed?: unknown } | null;
    if (nested && typeof nested.parsed === 'string') return nested.parsed;
  }

  // partially-decoded instructions that still point at the memo program
  let programIdString: string | null = null;
  if (instr.programId) {
    programIdString =
      typeof instr.programId === 'string' ? instr.programId : instr.programId.toBase58();
  }
  if (programIdString === MEMO_PROGRAM_ID_STRING) {
    // data would be base64 here; best-effort decode
    const raw = ix as { data?: unknown };
    if (typeof raw.data === 'string') return decodeBase64Utf8(raw.data);
  }
  return null;
}

function decodeBase64Utf8(base64: string): string {
  try {
    if (typeof atob !== 'function') return '';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

interface SignatureInfoLike {
  signature: string;
  slot: number;
}

interface AccountKeyLike {
  pubkey?: string | { toBase58(): string };
  signer?: boolean;
}

interface MessageLike {
  accountKeys: ReadonlyArray<AccountKeyLike | string>;
  instructions: readonly unknown[];
}

/** Normalize a parsed account key (base58 string or web3 PublicKey) to a string. */
function keyToString(key: AccountKeyLike | string | undefined): string {
  if (typeof key === 'string') return key;
  const pubkey = key?.pubkey;
  if (typeof pubkey === 'string') return pubkey;
  return pubkey?.toBase58?.() ?? '';
}

function getSignerAddress(message: MessageLike): string {
  const signer = message.accountKeys.find((k) => typeof k !== 'string' && k.signer);
  return keyToString(signer ?? message.accountKeys[0]);
}

function flattenInstructions(tx: unknown): unknown[] {
  if (!tx || typeof tx !== 'object') return [];
  const out: unknown[] = [];
  const transaction = tx as { transaction?: { message?: MessageLike } };
  const meta = tx as {
    meta?: {
      innerInstructions?: ReadonlyArray<{ instructions?: readonly unknown[] }>;
    };
  };
  out.push(...(transaction.transaction?.message?.instructions ?? []));
  for (const inner of meta.meta?.innerInstructions ?? []) {
    out.push(...(inner.instructions ?? []));
  }
  return out;
}

async function decodeSignature(sigInfo: SignatureInfoLike): Promise<MemoPost | null> {
  try {
    // jsonParsed (getParsedTransaction) is required: it's what makes the RPC
    // return per-instruction `program`/`programId`/`parsed` fields and account
    // keys as objects with signer flags. Plain getTransaction() returns
    // `encoding: "json"` (raw base64 data + programIdIndex) which we can't
    // reliably attribute to the Memo program.
    const tx = await connection.getParsedTransaction(sigInfo.signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });
    if (!tx || !tx.meta || tx.meta.err) return null;

    const message = tx.transaction.message as unknown as MessageLike;
    let memo = '';
    for (const ix of flattenInstructions(tx)) {
      const text = extractMemoText(ix);
      if (text) {
        memo = text;
        break;
      }
    }
    if (!memo) return null;

    const signer = getSignerAddress(message);
    return {
      signature: sigInfo.signature,
      slot: sigInfo.slot,
      signer,
      memo,
      timestampMs: (tx.blockTime ?? Date.now() / 1000) * 1000,
    };
  } catch {
    return null;
  }
}

/**
 * Stream the most recent N memo transactions written to the genesis Memo program.
 * Works with no wallet — this is real on-chain history from the Cookie Chain RPC.
 *
 * `seen` lets the caller skip signatures that were already decoded on a prior
 * poll, so the 20s silent refresh only decodes genuinely new posts instead of
 * re-decoding the same history (kinder to the free public RPC).
 */
export async function fetchRecentMemos(
  limit = 30,
  seen = new Set<string>(),
): Promise<MemoPost[]> {
  const signatures = await connection.getSignaturesForAddress(
    memoProgramKey,
    { limit },
    'confirmed',
  );
  const unknown: SignatureInfoLike[] = [];
  for (const s of signatures) {
    if (!seen.has(s.signature)) unknown.push(s);
    seen.add(s.signature);
  }
  const posts: MemoPost[] = [];
  // Small concurrency window so the free public RPC isn't hammered.
  const chunkSize = 6;
  for (let i = 0; i < unknown.length; i += chunkSize) {
    const chunk = unknown.slice(i, i + chunkSize);
    const settled = await Promise.allSettled(chunk.map((s) => decodeSignature(s)));
    for (const r of settled) {
      if (r.status === 'fulfilled' && r.value) posts.push(r.value);
    }
  }
  return posts.sort((a, b) => b.timestampMs - a.timestampMs);
}

/** Resolve a just-confirmed signature into a post so the board updates instantly. */
export async function fetchMemoBySignature(signature: string): Promise<MemoPost | null> {
  return decodeSignature({ signature, slot: 0 });
}

let cachedGenesisHash: string | null = null;

/** Current slot + genesis hash for the live chip. Genesis never changes, so it's cached. */
export async function fetchChainStatus(): Promise<{ slot: number; genesisHash: string }> {
  cachedGenesisHash ??= await connection.getGenesisHash();
  const slot = await connection.getSlot('confirmed');
  return { slot, genesisHash: cachedGenesisHash };
}
