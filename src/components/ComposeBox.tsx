import { useState } from 'react';
import { Transaction, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MEMO_PROGRAM_ID, explorerTxUrl } from '../lib/cookie-chain';
import { connection as fallbackConnection, fetchMemoBySignature } from '../lib/memo-feed';
import { getWalletErrorMessage } from '../lib/tx-errors';
import type { MemoPost, PostStatus } from '../lib/types';

const MAX_LENGTH = 300;

const QUICK_POSTS = [
  'gm Cookie Chain 👋 — wallpost from Cookie Wall',
  '350ms finality. sub-second on-chain posts. 🍪',
  'First post from my wallet on the Cookie Chain Memo board',
];

export function ComposeBox({ onPosted }: { onPosted: (post: MemoPost) => void }) {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<PostStatus>('idle');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const canPost = connected && publicKey && text.trim().length > 0 && status !== 'pending';

  const postMemo = async (raw: string) => {
    if (!connected || !publicKey || status === 'pending') return;
    const memo = raw.trim();
    if (!memo) return;

    setStatus('pending');
    setError('');
    setSignature('');
    try {
      const rpc = connection ?? fallbackConnection;
      const latest = await rpc.getLatestBlockhash('confirmed');
      // Memo program input is raw UTF-8 bytes; TextEncoder keeps us free of the
      // Node `buffer` module so it works in the browser without a polyfill.
      const data = new TextEncoder().encode(memo) as unknown as TransactionInstruction['data'];
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data,
      });
      const transaction = new Transaction({
        feePayer: publicKey,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      }).add(instruction);

      const sig = await sendTransaction(transaction, rpc, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      setSignature(sig);

      await rpc.confirmTransaction(
        { signature: sig, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight },
        'confirmed',
      );

      const decoded = await fetchMemoBySignature(sig);
      if (decoded) {
        setText('');
        onPosted(decoded);
        setStatus('confirmed');
      } else {
        setStatus('confirmed');
      }
    } catch (e) {
      setStatus('error');
      setError(getWalletErrorMessage(e));
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Write to the wall</h2>
        {connected && publicKey && (
          <span className="text-xs text-zinc-500">
            ~0.000005 COOK fee (5,000 lamports)
          </span>
        )}
      </div>

      {!connected || !publicKey ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-center text-sm text-zinc-400">
          Connect a <span className="text-amber-300">Nightly</span> wallet (switch it to Cookie
          Chain above) to sign a real memo transaction.
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LENGTH}
            rows={3}
            placeholder="Drop a note on Cookie Chain. Every post is a real, permanent on-chain Memo transaction…"
            className="mt-3 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500/60"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_POSTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setText(q)}
                  className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400 transition hover:border-amber-500/50 hover:text-amber-300"
                >
                  {q.slice(0, 28)}…
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${text.length >= MAX_LENGTH ? 'text-amber-400' : 'text-zinc-600'}`}>
                {text.length}/{MAX_LENGTH}
              </span>
              <button
                type="button"
                onClick={() => void postMemo(text)}
                disabled={!canPost}
                className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'pending' ? 'Posting…' : 'Post on-chain'}
              </button>
            </div>
          </div>
        </>
      )}

      {status === 'confirmed' && signature && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          <span>Confirmed on Cookie Chain.</span>
          <a
            href={explorerTxUrl(signature)}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-emerald-200 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-100"
          >
            View tx on CookieScan ↗
          </a>
        </div>
      )}
      {status === 'error' && (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}
