# Cookie Wall — Superteam Earn Submission Kit

Bounty: **Create an App on Cookie Chain ($1,000 USDC)**
Deadline: **2026-09-22 21:59 UTC** (verified via Superteam API 2026-09-11)
Live URL: https://sidsri14.github.io/cookie-chain-svm-capp/
Repo: https://github.com/sidsri14/cookie-chain-svm-capp
Screenshots: `screenshots/01-home-feed.png`, `02-connect-modal.png`, `03-live-deploy.png`

---

## 1. Pitch (submission body — 244 words)

> **Cookie Wall — a live on-chain memo board on Cookie Chain.**
>
> Every message on Cookie Wall is a real, signed transaction to the Solana Memo program
> (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`), which is deployed at genesis on Cookie
> Chain. Browsing the wall streams the actual chain history — no mock data, no seeded
> database, no paid API. You can verify any post on CookieScan.
>
> **What it does**
> - **Post a memo.** Connect Nightly (or Phantom / Solflare), sign one memo tx, watch it
>   confirm on Cookie Chain. Base fee is ~5,000 lamports (~0.000005 COOK).
> - **Live memo feed.** Reads `getSignaturesForAddress` + `getTransaction` (jsonParsed)
>   from `rpc.cookiescan.io` and decodes every memo instruction with its signer and
>   timestamp. The feed works **without a wallet** — it is the real, chain-wide history.
> - **Native COOK balance** for the connected wallet, read straight from Cookie Chain.
> - **One-click network switch.** The chain-status card re-targets the Nightly wallet to
>   the Cookie Chain genesis hash via `changeNetwork`, and confirms the genesis matches.
> - **Explorer deep links** on every signature and signer.
>
> **Why it's honest.** No contract deployment (the Memo program is genesis-deployed), no
> token, no DEX, no paid RPC key — just the primitives Cookie Chain guarantees. Fast
> (sub-second post latency), verifiable end-to-end, and small enough to read in one sitting.
>
> **Stack:** React 19 + TypeScript (Vite), `@solana/web3.js`, `@solana/wallet-adapter`,
> Tailwind. Deployed via GitHub Pages.

---

## 2. Loom demo script (~2 min, dead air trimmed)

Record at https://sidsri14.github.io/cookie-chain-svm-capp/ — full-screen browser, wallet popped out.

| # | Timestamp | On screen | Say |
|---|-----------|-----------|-----|
| 0 | 0:00–0:12 | Landing page, feed already populated, live slot ticking in the chain-status card | "This is Cookie Wall — a live memo board on Cookie Chain SVM. Everything you see is real on-chain data, read straight from the Cookie Chain RPC. Watch the slot counter — that's the chain moving in real time." |
| 1 | 0:12–0:33 | Scroll the memo feed; hover a signature; click a CookieScan link | "The feed decodes every Memo-program instruction from real chain history and shows the signer and timestamp. Each post deep-links to CookieScan. Notice it works with no wallet connected — this is the chain-wide feed, not my local state." |
| 2 | 0:33–0:52 | Click the network-switch card → "Switch Nightly → Cookie Chain" | "The chain-status card reads the genesis hash and confirms it's Cookie Chain. One click re-targets the Nightly wallet to the Cookie Chain network by genesis hash — so nobody has to add the RPC by hand." |
| 3 | 0:52–1:15 | Open the connect modal, connect Nightly — **need COOK here**, see note | "I connect my Nightly wallet. Here's the part that proves it's real: the balance is read from Cookie Chain itself, so if the wallet has no COOK, the Post button disables and the app tells you exactly how to get gas — bridge from Solana or grab a little from the Telegram." |
| 4 | 1:15–1:45 | Type a message → Post → tx confirms in feed → click CookieScan tx link | "I sign one memo transaction. It confirms in well under a second on Cookie Chain, appears at the top of my feed instantly, and here it is on CookieScan — a real Memo-program instruction from my wallet. No backend, no database." |
| 5 | 1:45–2:00 | Scroll back to feed, end on the hero | "That's Cookie Wall: post and read real on-chain memos on Cookie Chain with nothing but a wallet and the primitives the chain ships. Built for the Cookie Chain app bounty. Thanks for watching." |

**Recording notes**
- Do a dry run of the feed + network-switch beats first; keep the wallet already on the
  Cookie Chain network so segment 3 is smooth.
- Segment 3 is the only place a funded wallet is required (a real post). Everything else
  can be recorded on an empty wallet. **See the COOK note below before recording.**
- Trim dead air; target ≤ 2:15.

---

## 3. ⚠️ Blocker before recording segment 3 — the posting wallet needs COOK

Cookie Chain has **no faucet** (confirmed 2026-09-09). To post a real memo on camera the
recording wallet needs ≥ ~0.000005 COOK (5,000 lamports fee). Three ways:

1. **Telegram** — ask in https://t.me/TheCookieNetChain for a small COOK drip to your address.
2. **Bridge from Solana** — https://hyperlane.cookiescan.io.
3. **DEX swap** — buy COOK on-chain.

Once funded: switch the wallet to Cookie Chain in-app, post, and the screenshot/live URL
will show a real memo authored by your wallet.

### Draft message — post in https://t.me/TheCookieNetChain

> Hi all — building a small demo app for the Cookie Chain app bounty (a live on-chain memo
> board that reads/writes the Memo program). I just need to post one real memo on camera for
> the demo. Could someone send a tiny COOK drip to cover the ~5,000 lamport fee? My address:
>
> `<<PASTE YOUR NIGHTLY WALLET ADDRESS HERE>>`
>
> Happy to send a screenshot of the confirmed tx back in here. Thanks!

(Tip: paste the address you'll actually record with — the Nightly wallet switched to Cookie
Chain. A single drip of a fraction of a COOK covers thousands of posts.)

---

## 4. Submission checklist

- [ ] Wallet funded with COOK (segment 3)
- [ ] Screenshot of a **real memo you posted** (hero shot)
- [ ] Record Loom (~2 min) using the script above
- [ ] Copy the pitch block (section 1) into the Superteam submission
- [ ] Attach screenshots (`screenshots/01..03` + the new post screenshot)
- [ ] Live URL: https://sidsri14.github.io/cookie-chain-svm-capp/
- [ ] Repo URL: https://github.com/sidsri14/cookie-chain-svm-capp
- [ ] Submit on Superteam Earn before **2026-09-22 21:59 UTC**
