import React, { useState } from 'react';
import { CookieToken, CookieScanBlock } from './types';
import confetti from 'canvas-confetti';
import {
  Cookie, Zap, Rocket, Terminal, Layers, RefreshCw, CheckCircle2,
  Copy, ExternalLink, TrendingUp, DollarSign, Wallet, Sparkles,
  ArrowRight, Activity, PlusCircle, Search, ShieldCheck
} from 'lucide-react';

const INITIAL_TOKENS: CookieToken[] = [
  {
    id: 'tok-1',
    name: 'ChocoChip AI',
    symbol: '$CHIP',
    price: 0.042,
    marketCap: 420000,
    progressPercent: 78,
    holders: 1420,
    creator: 'CookieDev84',
    txHash: '5Kn8Yv...3q9LmX',
    description: 'Autonomous machine learning agent swarm running on Cookie Chain SVM.'
  },
  {
    id: 'tok-2',
    name: 'CookieSwap Gov',
    symbol: '$CKIE',
    price: 0.125,
    marketCap: 1250000,
    progressPercent: 100,
    holders: 3890,
    creator: 'FlintMaker',
    txHash: '7Rt2Wx...1p8YnZ',
    description: 'Native governance and fee-rebate token for the premier Cookie Chain DEX.'
  },
  {
    id: 'tok-3',
    name: 'Fortune Byte',
    symbol: '$BYTE',
    price: 0.008,
    marketCap: 80000,
    progressPercent: 45,
    holders: 610,
    creator: 'AlexSVM',
    txHash: '9xP4vK...3mL8q',
    description: 'Decentralized prediction market oracle token on Cookie Chain.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'launchpad' | 'swap' | 'scan' | 'mcp'>('launchpad');
  const [tokens, setTokens] = useState<CookieToken[]>(INITIAL_TOKENS);
  const [selectedToken, setSelectedToken] = useState<CookieToken>(INITIAL_TOKENS[0]);
  
  // Launchpad Form
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenSymbol, setNewTokenSymbol] = useState('');
  const [newTokenDesc, setNewTokenDesc] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Swap State
  const [swapAmount, setSwapAmount] = useState<number>(10);
  const [isSwapping, setIsSwapping] = useState(false);

  const [copiedMcp, setCopiedMcp] = useState(false);

  const handleDeployToken = async () => {
    if (!newTokenName || !newTokenSymbol) return;
    setIsDeploying(true);
    await new Promise(r => setTimeout(r, 800));

    const created: CookieToken = {
      id: `tok-${Date.now()}`,
      name: newTokenName,
      symbol: newTokenSymbol.startsWith('$') ? newTokenSymbol : `$${newTokenSymbol}`,
      price: 0.001,
      marketCap: 10000,
      progressPercent: 5,
      holders: 1,
      creator: 'You',
      txHash: '8bN2v...4kL9p',
      description: newTokenDesc || 'Decentralized token deployed on Cookie Chain SVM.'
    };

    setTokens([created, ...tokens]);
    setSelectedToken(created);
    setNewTokenName('');
    setNewTokenSymbol('');
    setNewTokenDesc('');
    setIsDeploying(false);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.65 } });
  };

  const handleSwap = async () => {
    setIsSwapping(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSwapping(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  const copyMcpConfig = () => {
    const text = `{
  "mcpServers": {
    "cookie-chain": {
      "command": "npx",
      "args": ["-y", "@cookie-chain/cookie-mcp"],
      "env": {
        "RPC_URL": "https://rpc.cookiechain.io",
        "SVM_NETWORK": "mainnet"
      }
    }
  }
}`;
    navigator.clipboard.writeText(text);
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-zinc-100 selection:bg-amber-500/30">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-yellow-950/40 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center space-x-2">
        <Cookie className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold">Cookie Chain SVM Developer Challenge</span>
        <span className="text-zinc-400">·</span>
        <span className="text-zinc-300">Fast SVM Infrastructure · $0.05 Program Deployments ($1,000 USDC Bounty)</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090D16]/90 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <Cookie className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-white tracking-tight">CookieFi Portal</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                  SVM NATIVE
                </span>
              </div>
              <p className="text-[9px] text-zinc-400 font-mono">COOKIE CHAIN TOKEN LAUNCHPAD & DEX</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('launchpad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'launchpad' ? 'bg-amber-500 text-black shadow-md font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Token Launchpad</span>
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'swap' ? 'bg-orange-500 text-black shadow-md font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Cookieswap DEX</span>
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'scan' ? 'bg-cyan-500 text-black shadow-md font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>CookieScan Live</span>
            </button>
            <button
              onClick={() => setActiveTab('mcp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'mcp' ? 'bg-purple-500 text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Cookie-MCP</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Network Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">SVM Finality</span>
            <p className="text-xl font-black text-amber-400 font-mono">350 ms</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Average Fee</span>
            <p className="text-xl font-black text-emerald-400 font-mono">$0.00008</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Deployment Cost</span>
            <p className="text-xl font-black text-cyan-400 font-mono">~$0.05</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Network TPS</span>
            <p className="text-xl font-black text-purple-400 font-mono">4,850 TPS</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TOKEN LAUNCHPAD */}
        {/* ========================================================================= */}
        {activeTab === 'launchpad' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Create Token Form */}
            <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-amber-400 font-mono uppercase">Instant SVM Deployment</span>
                <h3 className="text-xl font-black text-white mt-1">Deploy Bonding Curve Token</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Launch on Cookie Chain with sub-second confirmation and ~$0.05 deployment fee.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase block mb-1.5">Token Name</label>
                  <input
                    type="text"
                    value={newTokenName}
                    onChange={e => setNewTokenName(e.target.value)}
                    placeholder="e.g. CyberCookie"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase block mb-1.5">Token Symbol</label>
                  <input
                    type="text"
                    value={newTokenSymbol}
                    onChange={e => setNewTokenSymbol(e.target.value)}
                    placeholder="e.g. $COOK"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase block mb-1.5">Description</label>
                  <textarea
                    value={newTokenDesc}
                    onChange={e => setNewTokenDesc(e.target.value)}
                    placeholder="Describe your project vision..."
                    rows={3}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 outline-none resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleDeployToken}
                disabled={isDeploying || !newTokenName || !newTokenSymbol}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-black font-extrabold text-xs flex items-center justify-center space-x-2 hover:scale-[1.01] transition-transform cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deploying Program to Cookie Chain SVM (~$0.05)...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Deploy Token (Cost: $0.05)</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Live Token Feed */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Trending Tokens on Cookie Chain ({tokens.length})
              </span>

              <div className="space-y-3">
                {tokens.map(token => (
                  <div
                    key={token.id}
                    onClick={() => setSelectedToken(token)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedToken.id === token.id
                        ? 'bg-zinc-900 border-amber-500/50 shadow-md'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{token.name}</span>
                        <span className="text-xs font-mono text-amber-400 font-bold">{token.symbol}</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">${token.price}</span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1">{token.description}</p>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Bonding Curve Progress</span>
                        <span className="text-amber-400 font-bold">{token.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${token.progressPercent}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COOKIESWAP DEX */}
        {/* ========================================================================= */}
        {activeTab === 'swap' && (
          <div className="max-w-lg mx-auto bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-orange-400 font-mono uppercase">Cookieswap Terminal</span>
                <h3 className="text-xl font-black text-white mt-0.5">Instant SVM Swap</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">0.05% FEE</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">You Pay (SOL)</span>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={e => setSwapAmount(+e.target.value)}
                    className="bg-transparent text-xl font-black text-white font-mono outline-none w-1/2"
                  />
                  <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700">SOL</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">You Receive ({selectedToken.symbol})</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {((swapAmount * 180) / selectedToken.price).toFixed(0)}
                  </span>
                  <span className="text-sm font-bold text-amber-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700">{selectedToken.symbol}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSwap}
              disabled={isSwapping}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-sm flex items-center justify-center space-x-2 hover:scale-[1.01] transition-transform cursor-pointer shadow-lg shadow-orange-500/25 disabled:opacity-50"
            >
              {isSwapping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing 350ms SVM Swap...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Execute Swap on Cookieswap</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: COOKIESCAN EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'scan' && (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase">api.cookiescan.io Telemetry</span>
              <h2 className="text-2xl font-black text-white mt-1">Cookie Chain SVM Block Explorer</h2>
              <p className="text-xs text-zinc-400 mt-1">Live on-chain blocks and transactions on the Cookie Chain network.</p>
            </div>

            <div className="space-y-3">
              {[
                { slot: 384920, txs: 48, time: '1s ago', proposer: 'Validator #04', fee: '$0.00008' },
                { slot: 384919, txs: 62, time: '2s ago', proposer: 'Validator #12', fee: '$0.00007' },
                { slot: 384918, txs: 39, time: '3s ago', proposer: 'Validator #01', fee: '$0.00009' },
                { slot: 384917, txs: 55, time: '4s ago', proposer: 'Validator #08', fee: '$0.00008' },
              ].map((b, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className="text-cyan-400 font-bold">Slot #{b.slot}</span>
                    <p className="text-[10px] text-zinc-500">{b.time} · Proposer: {b.proposer}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-white font-bold">{b.txs} Transactions</span>
                    <p className="text-[10px] text-emerald-400">Avg Fee: {b.fee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COOKIE-MCP */}
        {/* ========================================================================= */}
        {activeTab === 'mcp' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 font-mono uppercase">Model Context Protocol (MCP)</span>
                  <h3 className="text-xl font-black text-white mt-1">@cookie-chain/cookie-mcp Server</h3>
                </div>
                <button
                  onClick={copyMcpConfig}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedMcp ? 'Copied!' : 'Copy MCP Config'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-purple-300 overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "cookie-chain": {
      "command": "npx",
      "args": ["-y", "@cookie-chain/cookie-mcp"],
      "env": {
        "RPC_URL": "https://rpc.cookiechain.io",
        "SVM_NETWORK": "mainnet"
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-[#070A11] mt-16 py-8 text-center text-xs text-zinc-500">
        <p className="font-semibold text-zinc-400">CookieFi Portal — Native Cookie Chain SVM Application</p>
        <p className="font-mono mt-1 text-[10px] text-zinc-600">Built for Cookie Chain cApp Challenge ($1,000 USDC) · Integrated with Cookieswap & Cookie-MCP</p>
      </footer>
    </div>
  );
}
