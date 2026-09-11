import { useMemo } from 'react';
import type { MemoPost } from '../lib/types';

const HOUR_MS = 3_600_000;
const BUCKETS = 12;

/**
 * Compact on-chain activity panel, derived entirely from the memos already
 * decoded for the feed — no extra RPC calls. Reads real chain data: post
 * volume, distinct posters, and an hourly sparkline of the recent window.
 */
export function ChainStats({ posts }: { posts: MemoPost[] }) {
  const stats = useMemo(() => {
    const now = Date.now();
    const valid = posts.filter((p) => p.timestampMs > 0);
    const posters = new Set(valid.map((p) => p.signer)).size;
    const last24h = valid.filter((p) => now - p.timestampMs <= 24 * HOUR_MS).length;
    const last1h = valid.filter((p) => now - p.timestampMs <= HOUR_MS).length;

    // Oldest → newest hourly buckets over the recent window.
    const buckets = Array.from({ length: BUCKETS }, (_, i) => {
      const end = now - (BUCKETS - 1 - i) * HOUR_MS;
      const start = end - HOUR_MS;
      return valid.filter((p) => p.timestampMs > start && p.timestampMs <= end).length;
    });
    const peak = Math.max(1, ...buckets);

    return { total: valid.length, posters, last24h, last1h, buckets, peak };
  }, [posts]);

  const tiles = [
    { label: 'Memos in view', value: stats.total },
    { label: 'Unique posters', value: stats.posters },
    { label: 'Last 24h', value: stats.last24h },
    { label: 'Last hour', value: stats.last1h },
  ];

  return (
    <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-4 py-3">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          On-chain activity
        </h2>
        <span className="text-[10px] text-zinc-600">live chain data · last {BUCKETS}h</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-lg border border-zinc-800/50 bg-zinc-950/40 px-1 py-2 text-center"
          >
            <div className="text-lg font-semibold text-amber-300">
              {t.value.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] leading-tight text-zinc-500">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex h-12 items-end gap-1" aria-hidden="true">
        {stats.buckets.map((n, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-amber-600/30 to-amber-400/80"
            style={{ height: `${Math.max(6, (n / stats.peak) * 100)}%` }}
            title={`${n} memo${n === 1 ? '' : 's'} · ${BUCKETS - 1 - i}h ago`}
          />
        ))}
      </div>
    </section>
  );
}
