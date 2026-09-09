import { useEffect, useState } from 'react';
import { Transaction, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  MEMO_PROGRAM_ID,
  COOK_FEE_LAMPORTS,
  COOK_TELEGRAM_URL,
  COOK_BRIDGE_URL,
  explorerTxUrl,
} from '../lib/cookie-chain';
import { connection as fallbackConnection, fetchMemoBySignature } from '../lib/memo-feed';
import { getWalletErrorMessage } from '../lib/tx-errors';
import { formatCook } from '../lib/format';
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
  // Live COOK balance of the connected wallet on Cookie Chain. null = still
  // fetching / unknown; a known 0 balance means the fee-payer account doesn't
  // exist on-chain yet and any post would fail with "account not found".
  const [lamports, setLamports] = useState<number | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) {
      setLamports(null);
      return;
    }
    let cancelled = false;
    const rpc = connection ?? fallbackConnection;
    const read = () =>
      rpc
        .getBalance(publicKey, 'confirmed')
        .then((n) => {
          if (!cancelled) setLamports(n);
        })
        .catch(() => {
          if (!cancelled) setLamports(null);
        });
    void read();
    const timer = window.setInterval(read, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [connected, publicKey, connection]);

  const fundsKnown = lamports !== null;
  const fundsEnough = fundsKnown && lamports >= COOK_FEE_LAMPORTS;
  // Block posting only when we *know* the wallet can't pay the fee. If the
  // balance read failed (unknown), let the attempt go through — the error box
  // below will explain any failure precisely.
  const canPost =
    connected && publicKey && text.trim().length > 0 && status !== 'pending' && (!fundsKnown || fundsEnough);

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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Write to the wall</h2>
        {connected && publicKey && (
          <span className="text-right text-xs text-zinc-500">
            {formatCook(lamports, 6)} COOK balance
            <span className="text-zinc-600"> · ~0.000005 COOK post fee</span>
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
          {fundsKnown && !fundsEnough && publicKey && (
            <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-sm text-amber-200">
              <p className="font-semibold text-amber-100">
                Your wallet has 0 COOK on Cookie Chain yet.
              </p>
              <p className="mt-1 text-amber-200/90">
                Posting is a real signed on-chain transaction, so it needs a tiny gas
                fee (~0.000005 COOK / 5,000 lamports) — an unfunded wallet can&apos;t pay
                it and the tx is rejected with &quot;account not found&quot;. Cookie Chain has
                no faucet. Send a little COOK to this address from any Cookie Chain
                wallet, or get some from the{' '}
                <a
                  href={COOK_TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-amber-500/40 underline-offset-2 hover:text-amber-100"
                >
                  official Telegram
                </a>{' '}
                /{' '}
                <a
                  href={COOK_BRIDGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-amber-500/40 underline-offset-2 hover:text-amber-100"
                >
                  bridge
                </a>
                :
              </p>
              <code className="mt-1.5 block break-all rounded-lg bg-zinc-950/60 px-2.5 py-1.5 font-mono text-[11px] text-amber-300/90">
                {publicKey.toBase58()}
              </code>
            </div>
          )}
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
