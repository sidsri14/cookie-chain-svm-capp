import { useCallback, useEffect, useRef, useState } from 'react';
import { CookieWalletProvider } from './components/CookieWalletProvider';
import { ConnectButton } from './components/ConnectButton';
import { NetworkSwitchCard } from './components/NetworkSwitchCard';
import { ComposeBox } from './components/ComposeBox';
import { MemoFeed } from './components/MemoFeed';
import { fetchRecentMemos } from './lib/memo-feed';
import { getWalletErrorMessage } from './lib/tx-errors';
import { MEMO_PROGRAM_ID_STRING, COOKIE_EXPLORER_URL } from './lib/cookie-chain';
import type { MemoPost } from './lib/types';

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 grid-cols-2 gap-0.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 p-1.5">
        <div className="rounded-sm bg-black/80" />
        <div className="rounded-sm bg-black/80" />
        <div className="rounded-sm bg-black/80" />
        <div className="rounded-sm bg-black/80" />
      </div>
      <div className="leading-tight">
        <h1 className="text-lg font-bold tracking-tight text-zinc-50">
          Cookie<span className="text-amber-400">Wall</span>
        </h1>
        <p className="text-[11px] text-zinc-500">on-chain memo board · Cookie Chain SVM</p>
      </div>
    </div>
  );
}

function WallApp() {
  const [posts, setPosts] = useState<MemoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const feedBusy = useRef(false);
  // Signatures already decoded, so the 20s silent poll only fetches + decodes
  // genuinely new posts instead of re-decoding the same history every time
  // (keeps steady load on the free public RPC low).
  const seenSignatures = useRef(new Set<string>());

  const loadFeed = useCallback(async (silent: boolean) => {
    if (feedBusy.current) return;
    feedBusy.current = true;
    if (!silent) setRefreshing(true);
    try {
      const next = await fetchRecentMemos(30, seenSignatures.current);
      setPosts((prev) => {
        // Non-silent (initial load / manual refresh) with fresh results
        // replaces the wall. Everything else — a silent poll, or a refresh
        // that found nothing new — keeps existing posts and merges in new
        // ones, trimming to the newest 40.
        const base = new Map<string, MemoPost>();
        if (silent || next.length === 0) for (const p of prev) base.set(p.signature, p);
        for (const p of next) base.set(p.signature, p);
        return [...base.values()]
          .sort((a, b) => b.timestampMs - a.timestampMs)
          .slice(0, 40);
      });
      setError('');
    } catch (e) {
      setError(getWalletErrorMessage(e));
    } finally {
      feedBusy.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed(false);
    const timer = window.setInterval(() => void loadFeed(true), 20000);
    return () => window.clearInterval(timer);
  }, [loadFeed]);

  const handlePosted = useCallback((post: MemoPost) => {
    seenSignatures.current.add(post.signature);
    setPosts((prev) =>
      [post, ...prev.filter((p) => p.signature !== post.signature)].slice(0, 40),
    );
  }, []);

  const refresh = useCallback(() => void loadFeed(false), [loadFeed]);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <Logo />
        <ConnectButton />
      </header>

      <NetworkSwitchCard />

      <main className="flex flex-col gap-4">
        <ComposeBox onPosted={handlePosted} />

        <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-3 py-2 text-[11px] text-zinc-600">
          <p>
            Every post is a signed tx to the Memo program at{' '}
            <code className="font-mono">{MEMO_PROGRAM_ID_STRING.slice(0, 12)}…</code> — verifiable on{' '}
            <a
              href={`${COOKIE_EXPLORER_URL}/address/${MEMO_PROGRAM_ID_STRING}`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400/80 hover:text-amber-300"
            >
              CookieScan
            </a>
            .
          </p>
        </div>

        <MemoFeed
          posts={posts}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={refresh}
        />
      </main>

      <footer className="pt-2 text-center text-[11px] text-zinc-600">
        Built for Superteam Earn · Create an App on Cookie Chain
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CookieWalletProvider>
      <WallApp />
    </CookieWalletProvider>
  );
}
