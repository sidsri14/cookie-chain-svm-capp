import { explorerAddressUrl, explorerTxUrl, shortenAddress } from '../lib/cookie-chain';
import { formatClockTime, formatRelativeTime, formatSlot } from '../lib/format';
import type { MemoPost } from '../lib/types';

interface MemoFeedProps {
  posts: MemoPost[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  onRefresh: () => void;
}

export function MemoFeed({ posts, loading, refreshing, error, onRefresh }: MemoFeedProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Live wall feed</h2>
          <p className="text-xs text-zinc-500">
            Memo transactions written to the genesis Memo program — streamed from the Cookie Chain RPC
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-300 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-800/50" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      ) : posts.length === 0 ? (
        <p className="mt-6 text-center text-sm text-zinc-500">
          No memos found yet. Connect a wallet and post the first one!
        </p>
      ) : (
        <ul className="mt-4 max-h-[540px] space-y-2 overflow-y-auto pr-1">
          {posts.map((post) => (
            <li
              key={post.signature}
              className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 transition hover:border-zinc-700"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                <a
                  href={explorerAddressUrl(post.signer)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-amber-300/90 hover:text-amber-200"
                  title={post.signer}
                >
                  {shortenAddress(post.signer, 6)}
                </a>
                <span title={formatClockTime(post.timestampMs)}>
                  {post.timestampMs ? formatRelativeTime(post.timestampMs) : `slot ${formatSlot(post.slot)}`}
                </span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-200">
                {post.memo}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={explorerTxUrl(post.signature)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] text-zinc-600 transition hover:text-amber-400"
                >
                  {shortenAddress(post.signature, 8)} ↗
                </a>
                <span className="text-[11px] text-zinc-700">slot {formatSlot(post.slot)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
