# 🧱 Cookie Wall — On-Chain Memo Board for Cookie Chain SVM

> **Built for Superteam Earn — Create an App on Cookie Chain ($1,000 USDC)**
> A real, wallet-connected dApp that posts and reads **actual on-chain Memo transactions**
> against the Cookie Chain SVM RPC. No mock data, no invented programs, no paid API.

---

## What This Is

Cookie Wall is a live on-chain memo board on **Cookie Chain** — the Solana Virtual Machine
rollup/chain with ~350ms finality and native **COOK** gas. Every message is a real
transaction to the **Solana Memo program** (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`),
which is deployed at genesis on Cookie Chain. Posting writes a permanent, explorer-viewable
record to the chain; browsing streams the actual memo history from the Cookie Chain RPC.

### What actually works (verified against the live RPC)

- **Post a memo** — connect a **Nightly** (or Phantom / Solflare) wallet, sign a real
  memo transaction, see it confirm on-chain. Fee ≈ 5,000 lamports ≈ `0.000005 COOK`.
- **Live memo feed** — reads `getSignaturesForAddress` + `getTransaction` (jsonParsed)
  against `https://rpc.cookiescan.io` and decodes every memo instruction with its signer
  wallet and timestamp. Works **without a wallet** — it is the real chain history.
- **Native COOK balance** — reads the wallet's native balance on Cookie Chain.
- **Explorer links** — every signature deep-links to `https://cookiescan.io/tx/{sig}` and
  every signer to `/address/{addr}`.
- **Network switch** — the Nightly card re-targets the wallet to the Cookie Chain genesis
  hash `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` via `nightly.changeNetwork`.

### Built without

No contract deployment (Memo program is genesis-deployed), no DEX, no token creation,
no paid RPC key. Just the primitives the chain guarantees — this is the honest, minimal
"real app on Cookie Chain."

---

## Tech Stack

- **React 19 + TypeScript** (Vite build)
- **@solana/web3.js ^1.98** — connection, transaction building, confirmation
- **@solana/wallet-adapter** (base, nightly, phantom, react, react-ui, solflare)
- **Tailwind CSS v4**

Dependency versions are mirror-proven against a shipped Cookie Chain app (cookie-pulse),
including the React 19 / wallet-adapter peer resolution and the Nightly custom-network switch.

---

## Running Locally

```bash
npm install
npm run dev -- --port 5184
```

Open `http://localhost:5184/`. The memo feed + live slot chip load real chain data
immediately. Connect a Nightly wallet (set to the Cookie Chain network via the in-app
switch, or install with the Cookie Chain preset) to post.

---

## Project Layout

```
src/
├── lib/
│   ├── cookie-chain.ts   # RPC/explorer URLs, genesis hash, memo program consts
│   ├── nightly.ts        # Nightly provider helpers + custom-network switch
│   ├── tx-errors.ts      # human-readable wallet/tx error mapping
│   ├── format.ts         # COOK formatting + relative time
│   ├── types.ts          # shared types
│   └── memo-feed.ts      # RPC fetch: signatures → jsonParsed memo decode
├── components/           # wallet provider, connect, compose, feed, network card
├── App.tsx
├── index.css
└── main.tsx
```

---

## License
MIT License. Built for Superteam Earn.
