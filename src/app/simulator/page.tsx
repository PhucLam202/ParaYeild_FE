"use client";

import { useState } from "react";
import HeaderSection from "@/components/HeaderSection";

export default function SimulatorPage() {
    const [network, setNetwork] = useState("Acala Network");
    const [protocol, setProtocol] = useState("Liquidity Provision (DEX)");
    const [tokenA, setTokenA] = useState({ symbol: "DOT", color: "polkadot-gradient" });
    const [tokenB, setTokenB] = useState({ symbol: "vDOT", color: "bg-pink-500" });
    const [amount, setAmount] = useState(10000);
    const [timeRange, setTimeRange] = useState("90 Days");
    const [customRange, setCustomRange] = useState({ from: "", to: "" });
    const [slippage, setSlippage] = useState(0.5);
    const [compoundYield, setCompoundYield] = useState(true);
    const [xcmFees, setXcmFees] = useState(true);
    const [chartMetric, setChartMetric] = useState<"value" | "yield">("value");

    const tokens = [
        { symbol: "DOT", color: "polkadot-gradient" },
        { symbol: "vDOT", color: "bg-pink-500" },
        { symbol: "USDC", color: "bg-blue-500" },
        { symbol: "USDT", color: "bg-green-500" },
        { symbol: "LDOT", color: "bg-orange-500" },
        { symbol: "ACA", color: "bg-purple-500" },
    ];

    const handleTokenAChange = (symbol: string) => {
        const token = tokens.find(t => t.symbol === symbol);
        if (token) {
            if (symbol === tokenB.symbol && !((symbol === "DOT" && tokenB.symbol === "vDOT") || (symbol === "vDOT" && tokenB.symbol === "DOT"))) {
                // Prevent identical selection unless it's a known pair like DOT-vDOT
                // In this case, if they select the same one, swap or just block? 
                // User said "make sure rằng các token đã được chọn k dc chon lại ví dụ DOT-DOT,.. Nhưng DOt-vDOT thì được"
                return;
            }
            setTokenA(token);
        }
    };

    const handleTokenBChange = (symbol: string) => {
        const token = tokens.find(t => t.symbol === symbol);
        if (token) {
            if (symbol === tokenA.symbol && !((symbol === "DOT" && tokenA.symbol === "vDOT") || (symbol === "vDOT" && tokenA.symbol === "DOT"))) {
                return;
            }
            setTokenB(token);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] via-[#121212] to-[#0C0C0C] text-[#f1f1f1] font-sans selection:bg-[#00FFA3] selection:text-black relative overflow-hidden">
            {/* Technical Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Soft Radial Glows with new palette */}
                <div className="absolute left-[20%] top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-neon opacity-[0.07] blur-[120px]"></div>
                <div className="absolute right-[10%] bottom-0 -z-10 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#352F36] opacity-30 blur-[100px]"></div>
                {/* Additional depth element */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[#2B2B2B] opacity-10 blur-[150px] mix-blend-screen pointer-events-none z-[-1]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <HeaderSection />
                <div className="pt-24 pb-12 flex-grow">
                    <main className="mx-auto max-w-5xl px-4 space-y-12">
                        <section className="space-y-4 text-center md:text-left">
                            <div className="inline-flex flex-row items-center justify-center space-x-2 bg-accent-neon/10 border border-accent-neon/20 px-3 py-1 rounded-full mb-4">
                                <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse"></span>
                                <span className="text-xs font-bold text-accent-neon uppercase tracking-widest">Simulator Beta</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white lg:leading-tight">
                                Pro-Grade DeFi <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-neon to-emerald-400">Backtesting Engine</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
                                Simulate historical performance across Polkadot parachains. Optimize your yield strategies with high-precision XCM fee modeling and real-world slippage estimation.
                            </p>
                        </section>
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                                <span className="material-symbols-outlined text-accent-neon">settings</span>
                                <h2 className="text-xl font-bold text-white">Essential Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card rounded-xl p-6 space-y-6 md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Parachain Selection</label>
                                            <select
                                                value={network}
                                                onChange={(e) => setNetwork(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none"
                                            >
                                                <option>Acala Network</option>
                                                <option>Moonbeam</option>
                                                <option>Parallel Finance</option>
                                                <option>Astar Network</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Protocol Type</label>
                                            <select
                                                value={protocol}
                                                onChange={(e) => setProtocol(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none"
                                            >
                                                <option>Liquidity Provision (DEX)</option>
                                                <option>Liquid Staking</option>
                                                <option>Lending &amp; Borrowing</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Token Pair</label>
                                            <div className="flex items-center gap-1">
                                                <div className="relative flex-1 group">
                                                    <div className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white flex items-center justify-between hover:bg-white/10 transition-colors pointer-events-none min-w-0">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <div className={`size-4 rounded-full ${tokenA.color} flex-shrink-0 flex items-center justify-center text-[10px] font-bold`}>
                                                                {tokenA.symbol[0]}
                                                            </div>
                                                            <span className="text-sm font-bold truncate">{tokenA.symbol}</span>
                                                        </div>
                                                        <span className="material-symbols-outlined text-base text-slate-500 group-hover:text-accent-neon transition-colors flex-shrink-0">arrow_drop_down</span>
                                                    </div>
                                                    <select
                                                        value={tokenA.symbol}
                                                        onChange={(e) => handleTokenAChange(e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    >
                                                        {tokens.map(t => (
                                                            <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="text-slate-600 font-bold px-0.5 flex-shrink-0">
                                                    <span className="material-symbols-outlined text-lg leading-none">close</span>
                                                </div>

                                                <div className="relative flex-1 group">
                                                    <div className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white flex items-center justify-between hover:bg-white/10 transition-colors pointer-events-none min-w-0">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <div className={`size-4 rounded-full ${tokenB.color} flex-shrink-0 flex items-center justify-center text-[10px] font-bold`}>
                                                                {tokenB.symbol[0]}
                                                            </div>
                                                            <span className="text-sm font-bold truncate">{tokenB.symbol}</span>
                                                        </div>
                                                        <span className="material-symbols-outlined text-base text-slate-500 group-hover:text-accent-neon transition-colors flex-shrink-0">arrow_drop_down</span>
                                                    </div>
                                                    <select
                                                        value={tokenB.symbol}
                                                        onChange={(e) => handleTokenBChange(e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    >
                                                        {tokens.map(t => (
                                                            <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Initial Amount ($)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                                <input
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-8 pr-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none"
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Range</label>
                                            <div className="flex gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <select
                                                        value={timeRange}
                                                        onChange={(e) => setTimeRange(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none"
                                                    >
                                                        <option>90 Days</option>
                                                        <option>180 Days</option>
                                                        <option>1 Year</option>
                                                        <option>Custom Range</option>
                                                    </select>
                                                </div>
                                                {timeRange === "Custom Range" && (
                                                    <div className="flex-1 flex gap-2">
                                                        <input
                                                            type="date"
                                                            value={customRange.from}
                                                            onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-accent-neon"
                                                        />
                                                        <input
                                                            type="date"
                                                            value={customRange.to}
                                                            onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-accent-neon"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card rounded-xl p-6 space-y-6 md:col-span-2">
                                    <div className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-accent-neon transition-colors">tune</span>
                                            <span className="text-sm font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">Advanced Parameters</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400">keyboard_arrow_down</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm text-slate-300">Slippage Tolerance</label>
                                                <span className="text-sm font-mono text-accent-neon">{slippage.toFixed(2)}%</span>
                                            </div>
                                            <input
                                                className="w-full accent-accent-neon h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                                type="range"
                                                min="0.1"
                                                max="5"
                                                step="0.1"
                                                value={slippage}
                                                onChange={(e) => setSlippage(Number(e.target.value))}
                                            />
                                        </div>
                                        <div
                                            onClick={() => setCompoundYield(!compoundYield)}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${compoundYield ? 'bg-accent-neon/5 border-accent-neon/30' : 'bg-white/5 border-white/5'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">Compound Yield</span>
                                                <span className="text-xs text-slate-500">Auto-reinvest rewards</span>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <div className={`w-11 h-6 rounded-full transition-colors ${compoundYield ? 'bg-accent-neon' : 'bg-white/10'}`}></div>
                                                <div className={`absolute left-[2px] top-[2px] bg-black w-5 h-5 rounded-full transition-all ${compoundYield ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setXcmFees(!xcmFees)}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${xcmFees ? 'bg-accent-neon/5 border-accent-neon/30' : 'bg-white/5 border-white/5'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">XCM Fees Modeling</span>
                                                <span className="text-xs text-slate-500">Cross-chain overhead</span>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <div className={`w-11 h-6 rounded-full transition-colors ${xcmFees ? 'bg-accent-neon' : 'bg-white/10'}`}></div>
                                                <div className={`absolute left-[2px] top-[2px] bg-black w-5 h-5 rounded-full transition-all ${xcmFees ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 py-4 bg-accent-neon rounded-xl font-bold text-black text-lg hover:shadow-[0_0_40px_rgba(0,255,163,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Run Simulation
                                </button>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                                    Try Examples
                                </button>
                            </div>
                        </section>
                        <section className="space-y-8 pt-8">
                            <div className="flex items-center gap-2 px-1">
                                <span className="material-symbols-outlined text-accent-neon">analytics</span>
                                <h2 className="text-xl font-bold text-white">Simulation Results</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-card-dark to-[#0F2A14] border-accent-neon/30">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Final Value</p>
                                    <p className="text-4xl font-black neon-text font-mono">$14,821</p>
                                    <p className="text-xs text-accent-neon mt-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        +$4,821 profit
                                    </p>
                                </div>
                                <div className="glass-card rounded-xl p-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Return</p>
                                    <p className="text-4xl font-black text-white font-mono">+48.2%</p>
                                    <p className="text-xs text-slate-500 mt-2">vs. +12.4% HODL</p>
                                </div>
                                <div className="glass-card rounded-xl p-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Net APY</p>
                                    <p className="text-4xl font-black text-white font-mono">15.4%</p>
                                    <p className="text-xs text-slate-500 mt-2">After all fees</p>
                                </div>
                                <div className="glass-card rounded-xl p-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">IL Impact</p>
                                    <p className="text-4xl font-black text-red-400 font-mono">-2.1%</p>
                                    <p className="text-xs text-slate-500 mt-2">Historical variance</p>
                                </div>
                            </div>
                            <div className="glass-card rounded-xl p-6 md:p-8 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Portfolio Performance</h3>
                                        <p className="text-sm text-slate-500">
                                            Simulated strategy {chartMetric === "value" ? "value" : "yield"} over the last 90 days
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-1 rounded-lg">
                                        <button
                                            onClick={() => setChartMetric("value")}
                                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${chartMetric === "value" ? 'bg-accent-neon text-black' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            Value ($)
                                        </button>
                                        <button
                                            onClick={() => setChartMetric("yield")}
                                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${chartMetric === "yield" ? 'bg-accent-neon text-black' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            Yield (%)
                                        </button>
                                    </div>
                                </div>
                                <div className="relative w-full h-80 rounded-lg overflow-hidden flex items-end">
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <div className="w-full h-[1px] bg-emerald-900"></div>
                                    </div>
                                    <svg className="w-full h-full" viewBox="0 0 1000 300">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor={chartMetric === "value" ? "#00FFA3" : "#A855F7"} stopOpacity="0.4" />
                                                <stop offset="100%" stopColor={chartMetric === "value" ? "#00FFA3" : "#A855F7"} stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        {chartMetric === "value" ? (
                                            <>
                                                <path d="M0,250 Q100,230 200,240 T400,180 T600,210 T800,100 T1000,80 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
                                                <path d="M0,250 Q100,230 200,240 T400,180 T600,210 T800,100 T1000,80" fill="none" stroke="#00FFA3" strokeWidth="3" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M0,280 Q150,250 300,200 T600,150 T900,100 T1000,90 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
                                                <path d="M0,280 Q150,250 300,200 T600,150 T900,100 T1000,90" fill="none" stroke="#A855F7" strokeWidth="3" />
                                            </>
                                        )}
                                        <path d="M0,260 Q100,265 200,255 T400,250 T600,240 T800,235 T1000,230" fill="none" stroke="#64748b" strokeDasharray="8 4" strokeWidth="2" />
                                    </svg>
                                    <div className="absolute bottom-4 right-8 flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${chartMetric === "value" ? 'bg-accent-neon' : 'bg-purple-500'}`}></div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {chartMetric === "value" ? 'Simulation' : 'Net Yield'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HODL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h3 className="text-lg font-bold text-white">Component Breakdown</h3>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                                <th className="px-6 py-4">Component</th>
                                                <th className="px-6 py-4">Absolute Gain</th>
                                                <th className="px-6 py-4">Efficiency</th>
                                                <th className="px-6 py-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">Trading Fees Earned</td>
                                                <td className="px-6 py-4 text-accent-neon font-mono">+$1,240.22</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="w-[85%] h-full bg-accent-neon"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-1 rounded-md bg-accent-neon/10 text-accent-neon text-[10px] font-bold uppercase">Optimal</span></td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">Liquidity Mining Rewards</td>
                                                <td className="px-6 py-4 text-accent-neon font-mono">+$3,850.15</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="w-[92%] h-full bg-accent-neon"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-1 rounded-md bg-accent-neon/10 text-accent-neon text-[10px] font-bold uppercase">Harvested</span></td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">Impermanent Loss</td>
                                                <td className="px-6 py-4 text-red-400 font-mono">-$210.45</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="w-[12%] h-full bg-red-400"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-1 rounded-md bg-red-400/10 text-red-400 text-[10px] font-bold uppercase">Managed</span></td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">XCM Gas Overhead</td>
                                                <td className="px-6 py-4 text-slate-400 font-mono">-$58.42</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="w-[5%] h-full bg-slate-400"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-1 rounded-md bg-white/10 text-slate-400 text-[10px] font-bold uppercase">Deducted</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-2 px-1">
                                    <span className="material-symbols-outlined text-slate-400">menu_book</span>
                                    <h2 className="text-xl font-bold text-white">Methodology</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="glass-card rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-accent-neon/30 transition-colors">
                                        <span className="text-sm text-slate-300 font-medium">How we calculate XCM fee modeling?</span>
                                        <span className="material-symbols-outlined text-slate-500 group-hover:text-accent-neon">add</span>
                                    </div>
                                    <div className="glass-card rounded-xl p-4 flex items-center justify-between group cursor-pointer border-accent-neon/30 bg-accent-neon/5">
                                        <div className="space-y-2">
                                            <span className="text-sm text-accent-neon font-bold">Protocol Slippage Assumptions</span>
                                            <p className="text-xs text-slate-400 leading-relaxed">We use a dynamic orderbook snapshot from the selected historical timestamp to calculate real-world execution price impact based on your trade size.</p>
                                        </div>
                                        <span className="material-symbols-outlined text-accent-neon self-start">remove</span>
                                    </div>
                                </div>
                                <div className="border-l-4 border-orange-500 bg-orange-500/5 p-6 rounded-r-xl space-y-2">
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <span className="material-symbols-outlined">warning</span>
                                        <span className="text-sm font-bold uppercase tracking-widest">Risk Disclaimer</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Backtesting is based on historical data and does not guarantee future results. DeFi protocols are subject to smart contract risks, liquidity crunches, and rapid market fluctuations. Simulation results do not include tax implications.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 px-1">
                                    <span className="material-symbols-outlined text-slate-400">extension</span>
                                    <h2 className="text-xl font-bold text-white">Related Tools</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <a className="glass-card p-5 rounded-xl hover:border-accent-neon/50 transition-all group" href="#">
                                        <span className="material-symbols-outlined text-accent-neon mb-3">waves</span>
                                        <h4 className="text-white font-bold mb-1">Pool Analytics</h4>
                                        <p className="text-xs text-slate-500">Deep dive into specific parachain liquidity pools.</p>
                                    </a>
                                    <a className="glass-card p-5 rounded-xl hover:border-accent-neon/50 transition-all group" href="#">
                                        <span className="material-symbols-outlined text-accent-purple mb-3">calculate</span>
                                        <h4 className="text-white font-bold mb-1">XCM Fee Calculator</h4>
                                        <p className="text-xs text-slate-500">Instant cross-chain transfer cost estimator.</p>
                                    </a>
                                </div>
                            </div>
                        </section>
                    </main>
                    <footer className="border-t border-white/5 py-12 mt-12 bg-black/40">
                        <div className="mx-auto max-w-7xl px-4 text-center space-y-6">
                            <div className="flex justify-center items-center gap-2">
                                <div className="size-6 rounded-lg bg-accent-neon flex items-center justify-center text-[10px] text-black font-bold">PY</div>
                                <span className="text-sm font-bold text-slate-300 tracking-tight">Built by ParaYield Labs</span>
                            </div>
                            <p className="text-xs text-slate-500">© 2024 ParaYield DeFi Simulator. Not financial advice. Data provided by ecosystem partners.</p>
                            <div className="flex justify-center gap-6">
                                <a className="text-slate-500 hover:text-accent-neon transition-colors" href="#"><span className="material-symbols-outlined text-xl">public</span></a>
                                <a className="text-slate-500 hover:text-accent-neon transition-colors" href="#"><span className="material-symbols-outlined text-xl">terminal</span></a>
                                <a className="text-slate-500 hover:text-accent-neon transition-colors" href="#"><span className="material-symbols-outlined text-xl">forum</span></a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
