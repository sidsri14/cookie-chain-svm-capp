# Cookie Wall — Superteam Earn Submission Kit

Bounty: **Create an App on Cookie Chain ($1,000 USDC)** — 2 × 500 USDC prizes
Slug: `create-an-app-on-cookie-chain-app`
Deadline: **2026-09-22 21:59:59 UTC** (verified via Superteam API 2026-09-11)
Live URL: https://sidsri14.github.io/cookie-chain-svm-capp/
Repo: https://github.com/sidsri14/cookie-chain-svm-capp
Screenshots: `screenshots/01-home-feed.png`, `02-connect-modal.png`, `03-live-deploy.png`

---

## 0. What the bounty actually requires (verified verbatim 2026-09-11)

**Submission Requirements — "Submit the following:"**
1. **Live application URL** (form link field, required)
2. **GitHub repository** (form link field, required)
3. **Relevant program, contract, token, or application addresses** (form text field, required — "if applicable")

**Demo Requirements — "Create an X (Twitter) thread that:"**
- Explains what your application does
- Demonstrates how users can use it
- Includes a guide directing users to the Cookie Chain Bridge where relevant

**Final Step — "Share your X thread in the Cookie Chain Telegram community."**

**Technical Requirements:** source code must be open source; include a comprehensive README
with setup instructions.

> ⚠️ **There is NO video requirement.** An earlier draft of this file included a Loom
> script — that was an invention and has been removed. The demo deliverable is the **X thread**.

---

## 1. Pitch (submission body — paste into the description / repo README top)

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
> - **On-chain activity analytics.** Memos in view, unique posters, 24h/hourly volume, and a
>   12-hour sparkline — all derived from decoded chain data, no extra RPC calls.
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

## 2. Submission form answers (copy-paste — 3 required fields)

| Form field | Value |
|-----------|-------|
| **GitHub repository** (link) | `https://github.com/sidsri14/cookie-chain-svm-capp` |
| **Relevant program / contract / token / application addresses** (text) | `Memo program: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` · `Chain genesis: 9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` · `RPC: https://rpc.cookiescan.io` |
| **Live application URL** (link) | `https://sidsri14.github.io/cookie-chain-svm-capp/` |

Optional (if the form has an extra description box): paste the **pitch block from §1**.

---

## 3. X (Twitter) thread — the demo deliverable (ready to post)

Post as a thread from your X account. Attach `screenshots/01-home-feed.png` to post 1 and
`03-live-deploy.png` (a real confirmed memo) to post 5. Replace `{{...}}` once.

**Post 1/6**
> I built Cookie Wall — a live, on-chain memo board on Cookie Chain 🍪
>
> Every message is a real signed transaction to the Solana Memo program. No mock data, no
> database, no backend. Reading the wall streams the actual chain history.
>
> Live: https://sidsri14.github.io/cookie-chain-svm-capp/
> Code: https://github.com/sidsri14/cookie-chain-svm-capp
>
> 🧵 1/6

**Post 2/6 — what it does**
> What you can do:
> • Post a memo — sign one tx, it confirms on Cookie Chain in under a second
> • Read the chain-wide feed with no wallet connected — it's real history from the RPC
> • See on-chain activity: memos in view, unique posters, 24h volume + a 12h sparkline
> • Check your native COOK balance, straight from the chain
> 2/6

**Post 3/6 — how to use it**
> How to use it:
> 1. Open the site (the feed loads immediately — no login)
> 2. Click "Switch Nightly → Cookie Chain" — one click re-targets the wallet to the chain's
>    genesis hash, so you never add the RPC by hand
> 3. Connect Nightly / Phantom / Solflare
> 4. Type a message, hit Post, sign
> 5. Your memo appears at the top of the feed and deep-links to CookieScan
> 3/6

**Post 4/6 — need COOK? (bridge guide — required by the bounty)**
> Posting costs ~5,000 lamports (~0.000005 COOK) — a fraction of a cent. Cookie Chain has no
> faucet, so you need a little COOK first. If your wallet is empty the app detects it,
> disables Post, and links you straight to the bridge:
>
> 🌉 Bridge COOK from Solana: https://hyperlane.cookiescan.io
>
> The same card links the official Telegram for a small drip. 4/6

**Post 5/6 — proof it's real**
> Here's a real post I wrote — a signed Memo-program instruction from my wallet, confirmed
> on Cookie Chain and viewable on CookieScan. Every signature in the feed links to a real tx.
>
> [attach screenshots/03-live-deploy.png]
> 5/6

**Post 6/6 — close**
> Cookie Wall uses only the primitives Cookie Chain ships: the genesis Memo program + the
> public RPC. No contract deploy, no token, no paid API key. React 19 + @solana/web3.js.
>
> Built for the @Superteam Earn "Create an App on Cookie Chain" bounty. 🍪
>
> Live: https://sidsri14.github.io/cookie-chain-svm-capp/
> 6/6

---

## 4. Telegram post — Final Step ("Share your X thread in the Cookie Chain community")

Post this in https://t.me/TheCookieNetChain with the link to your thread:

> Hey all 🍪 I built **Cookie Wall** — a live on-chain memo board on Cookie Chain. Every post
> is a real signed Memo-program tx; the feed streams actual chain history. React 19 +
> @solana/web3.js, live here: https://sidsri14.github.io/cookie-chain-svm-capp/
>
> Wrote up how it works + how to use it (incl. the COOK bridge) in this thread:
> `<<PASTE YOUR X THREAD URL HERE>>`
>
> Feedback welcome! Built for the Superteam app bounty.

---

## 5. Submission checklist

- [ ] Post the X thread (§3) from your account — attach the two screenshots
- [ ] Share the thread link in the Cookie Chain Telegram (§4)
- [ ] On Superteam Earn, fill the 3 required fields from §2 (repo · addresses · live URL)
- [ ] Optionally paste the §1 pitch into the description box
- [ ] Attach screenshots (`screenshots/01..03` + the real-post shot)
- [ ] Submit before **2026-09-22 21:59:59 UTC**

### What is already done (no action needed)
- ✅ App is live and deploying on push to `master` (GitHub Pages)
- ✅ Repo is open source with a comprehensive README + setup instructions
- ✅ App contains the bridge guide required by the bounty (ComposeBox + tx-error messages)
- ✅ On-chain addresses (Memo program, genesis, RPC) are documented above and in the README
- ✅ Analytics panel (`ChainStats.tsx`) satisfies the "meaningful interaction" objective
