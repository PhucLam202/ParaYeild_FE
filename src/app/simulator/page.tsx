"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderSection from "@/components/HeaderSection";
import { simulatorService, SimulationResponse, SimulationRequest, TimeSeriesPoint, SuggestStrategiesResponse, SuggestedStrategy } from "@/services/simulatorService";
import { format, subDays } from "date-fns";
import Toast from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimulatorPage() {
    const [network, setNetwork] = useState("");
    const [protocol, setProtocol] = useState("");
    const [tokenA, setTokenA] = useState({ symbol: "DOT", color: "polkadot-gradient" });
    const [tokenB, setTokenB] = useState({ symbol: "vDOT", color: "bg-pink-500" });
    const [amount, setAmount] = useState(10000);
    const [timeRange, setTimeRange] = useState("90 Days");
    const [customRange, setCustomRange] = useState({ from: "", to: "" });
    const [slippage, setSlippage] = useState(0.5);
    const [compoundYield, setCompoundYield] = useState(true);
    const [xcmFees, setXcmFees] = useState(true);
    const [chartMetric, setChartMetric] = useState<"value" | "yield">("value");

    // API Integration States
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [showSuccessPulse, setShowSuccessPulse] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
    const [suggestedStrategies, setSuggestedStrategies] = useState<SuggestStrategiesResponse | null>(null);
    const [toastState, setToastState] = useState<{ message: string, type: 'error' | 'success' | 'info' | 'warning' } | null>(null);
    const [selectedStrategyForModal, setSelectedStrategyForModal] = useState<SuggestedStrategy | null>(null);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const defaultTokens = [
        { symbol: "DOT", color: "polkadot-gradient" },
        { symbol: "vDOT", color: "bg-pink-500" },
        { symbol: "USDC", color: "bg-blue-500" },
        { symbol: "USDT", color: "bg-green-500" },
        { symbol: "LDOT", color: "bg-orange-500" },
        { symbol: "ACA", color: "bg-purple-500" },
    ];

    const [fetchedTokens, setFetchedTokens] = useState<{ symbol: string; color: string }[]>(defaultTokens);
    const [fetchedParachains, setFetchedParachains] = useState<{ id: string, name: string }[]>([]);
    const [fetchedProtocols, setFetchedProtocols] = useState<{ id: string, label: string }[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const parachainsData = await simulatorService.getParachains();
                if (parachainsData.length > 0) {
                    setFetchedParachains(parachainsData);
                    setNetwork(parachainsData[0].id);
                }
            } catch (err) {
                console.error("Failed to load initial data", err);
                setIsLoadingInitial(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!network) {
            return;
        }

        const loadNetworkMetadata = async () => {
            setIsLoadingInitial(true);
            try {
                const [tokensData, protocolsData] = await Promise.all([
                    simulatorService.getTokens(network),
                    simulatorService.getProtocolTypes(network)
                ]);

                const fallbackColors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
                const mappedTokens = tokensData.map((t: any, i: number) => {
                    const preset = defaultTokens.find(dt => dt.symbol === t.symbol);
                    return preset || { symbol: t.symbol, color: fallbackColors[i % fallbackColors.length] };
                });

                setFetchedTokens(mappedTokens);
                if (mappedTokens.length > 0) {
                    setTokenA(mappedTokens[0]);
                    setTokenB(mappedTokens.length > 1 ? mappedTokens[1] : mappedTokens[0]);
                }

                setFetchedProtocols(protocolsData);
                if (protocolsData.length > 0) {
                    setProtocol(protocolsData[0].id);
                }
            } catch (err) {
                console.error("Failed to load network metadata", err);
            } finally {
                setIsLoadingInitial(false);
            }
        };

        loadNetworkMetadata();
    }, [network]);

    const handleTokenAChange = (symbol: string) => {
        const token = fetchedTokens.find(t => t.symbol === symbol);
        if (token) {
            setTokenA(token);
        }
    };

    const handleTokenBChange = (symbol: string) => {
        const token = fetchedTokens.find(t => t.symbol === symbol);
        if (token) {
            setTokenB(token);
        }
    };

    // Derived Date Ranges
    const dateRange = useMemo(() => {
        const today = new Date();
        let fromDate = new Date();

        switch (timeRange) {
            case "90 Days":
                fromDate = subDays(today, 90);
                break;
            case "180 Days":
                fromDate = subDays(today, 180);
                break;
            case "1 Year":
                fromDate = subDays(today, 365);
                break;
            case "Custom Range":
                if (customRange.from && customRange.to) {
                    return { from: customRange.from, to: customRange.to };
                }
                break;
        }

        return {
            from: format(fromDate, 'yyyy-MM-dd'),
            to: format(today, 'yyyy-MM-dd')
        };
    }, [timeRange, customRange]);

    const handleRunSimulation = async (customAllocations?: any[]) => {
        setIsSimulating(true);
        setToastState(null);
        setSimulationSteps([
            "Analyzing parachain liquidity...",
            "Fetching historical yield rates...",
            "Calculating XCM overhead...",
            "Optimizing token allocation...",
            "Finalizing simulation results..."
        ]);
        setCurrentStepIndex(0);

        try {
            // Simulate steps for UI feedback
            for (let i = 0; i < 5; i++) {
                await new Promise(resolve => setTimeout(resolve, i === 4 ? 200 : 800)); // Shorter delay for the last step
                setCurrentStepIndex(i + 1);
            }

            const request: SimulationRequest = {
                initialAmountUsd: amount,
                from: dateRange.from,
                to: dateRange.to,
                includeIL: protocol !== 'vstaking',
                xcmFeeUsd: xcmFees ? 0.5 : 0,
                allocations: customAllocations || [
                    {
                        protocol: network,
                        assetSymbol: protocol === 'vstaking' ? tokenA.symbol : (tokenB.symbol === "vDOT" ? "vDOT" : tokenA.symbol),
                        percentage: 100,
                        poolType: protocol
                    }
                ]
            };

            const result = await simulatorService.runSimulation(request);
            setSimulationResult(result);
            setShowSuccessPulse(true);
            setTimeout(() => setShowSuccessPulse(false), 2000);

            setToastState({ message: "Simulation completed successfully!", type: "success" });

            // Scroll to results
            setTimeout(() => {
                document.getElementById('simulation-results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err: any) {
            setToastState({ message: err.message || "An error occurred during simulation.", type: "error" });
            setSimulationSteps(["Simulation failed. Please check your inputs."]);
        } finally {
            setIsSimulating(false);
            setCurrentStepIndex(-1); // Reset step index
        }
    };

    const handleSuggestStrategies = async (refresh = false) => {
        setIsSuggesting(true);
        setToastState(null);
        try {
            // If it's a manual refresh, we hit the exact endpoint requested: ?refresh=true
            // Otherwise, we can use the default filters
            const fetchPromise = refresh
                ? simulatorService.suggestStrategies(undefined, undefined, true)
                : simulatorService.suggestStrategies("medium", 10, true);

            // Add a minimum visual delay of 1.5s to show the "Analyzing Markets" overlay properly
            const [response] = await Promise.all([
                fetchPromise,
                new Promise(resolve => setTimeout(resolve, 1500))
            ]);

            setSuggestedStrategies(response);
            setToastState({ message: "AI suggestions updated successfully!", type: "success" });
        } catch (err: any) {
            setToastState({ message: err.message || "Failed to get suggestions. The OpenAI service may be unavailable.", type: "error" });
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSelectStrategy = (strategy: SuggestedStrategy, shouldRun = false) => {
        if (!shouldRun) {
            setSelectedStrategyForModal(strategy);
            return;
        }

        if (strategy.allocations.length > 0) {
            const first = strategy.allocations[0];
            setNetwork(first.protocol);
            setProtocol(first.poolType);

            const matchedToken = fetchedTokens.find(t => t.symbol === first.assetSymbol);
            if (matchedToken) {
                setTokenA(matchedToken);
            }

            // Run simulation with the full allocations from the strategy
            handleRunSimulation(strategy.allocations.map(a => ({
                protocol: a.protocol,
                assetSymbol: a.assetSymbol,
                percentage: a.percentage,
                poolType: a.poolType
            })));
        }
    };

    // Render Helpers for the Chart Line Generator Function
    const generateChartPath = (data: TimeSeriesPoint[], key: 'totalValueUsd' | 'dailyReturnPct', isHodl = false) => {
        if (!data || data.length === 0) return "";
        const width = 1000;
        const height = 300;
        const padding = 20;

        const maxPoints = data.length;
        if (maxPoints < 2) return "";

        // Find min max
        let maxVal = -Infinity;
        let minVal = Infinity;

        data.forEach((d, index) => {
            const val = key === 'totalValueUsd' ? (isHodl ? simulationResult!.summary.initialAmountUsd * (1 + (0.035 * (index / 365))) : d[key]) : (isHodl ? 3.5 * (index / maxPoints) : d[key]);
            if (val > maxVal) maxVal = val;
            if (val < minVal) minVal = val;
        });

        // Add buffer
        const range = maxVal - minVal;
        const bufferedMax = maxVal + (range * 0.1) || 1;
        const bufferedMin = minVal - (range * 0.1) || 0;
        const bufferedRange = bufferedMax - bufferedMin;

        // Create Path
        let path = data.map((d, index) => {
            const val = key === 'totalValueUsd' ? (isHodl ? simulationResult!.summary.initialAmountUsd * (1 + (0.035 * (index / 365))) : d[key]) : (isHodl ? 3.5 * (index / maxPoints) : d[key]);
            const x = (index / (maxPoints - 1)) * width;
            const y = height - padding - ((val - bufferedMin) / bufferedRange) * (height - 2 * padding);
            return `${index === 0 ? "M" : "L"}${x},${y}`;
        }).join(" ");

        return path;
    };

    // Fallback Data if empty
    const hodlReturnPercent = 3.5; // Mock HODL return

    const generateSparklinePath = (data: any[], key: string) => {
        if (!data || data.length < 2) return "";
        const max = Math.max(...data.map(d => d[key]));
        const min = Math.min(...data.map(d => d[key]));
        const range = max - min || 1;

        return data.map((d, i) => {
            const x = (i / (data.length - 1)) * 60;
            const y = 20 - ((d[key] - min) / range) * 20;
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        }).join(" ");
    };

    const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!chartContainerRef.current || !simulationResult || simulationResult.timeSeries.length === 0) return;

        const rect = chartContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        const percent = Math.max(0, Math.min(1, x / width));
        const index = Math.round(percent * (simulationResult.timeSeries.length - 1));
        setHoveredPoint(index);
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

            <AnimatePresence>
                {toastState && (
                    <Toast
                        message={toastState.message}
                        type={toastState.type as any}
                        onClose={() => setToastState(null)}
                    />
                )}
            </AnimatePresence>

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
                                <div className="glass-card rounded-xl p-6 space-y-6 md:col-span-2 relative overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {isLoadingInitial ? (
                                            <motion.div
                                                key="skeleton"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-6"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="space-y-2">
                                                            <Skeleton className="h-4 w-24 bg-white/10" />
                                                            <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32 bg-white/10" />
                                                        <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-24 bg-white/10" />
                                                        <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="content"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-6"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Parachain Selection</label>
                                                        <select
                                                            value={network}
                                                            onChange={(e) => setNetwork(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none capitalize"
                                                        >
                                                            {fetchedParachains.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Protocol Type</label>
                                                        <select
                                                            value={protocol}
                                                            onChange={(e) => setProtocol(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none capitalize"
                                                        >
                                                            {fetchedProtocols.map(p => (
                                                                <option key={p.id} value={p.id}>{p.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            {protocol === 'vstaking' ? 'Token Selection' : 'Token Pair'}
                                                        </label>
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
                                                                    {fetchedTokens.map(t => (
                                                                        <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {protocol !== 'vstaking' && (
                                                                <>
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
                                                                            {fetchedTokens.map(t => (
                                                                                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </>
                                                            )}
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                        </section>
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-accent-neon">auto_awesome</span>
                                    <h2 className="text-xl font-bold text-white">AI-Powered Suggestions</h2>
                                </div>
                                <button
                                    onClick={() => handleSuggestStrategies(true)}
                                    disabled={isSuggesting}
                                    className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isSuggesting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-neon/20 hover:text-accent-neon'}`}
                                >
                                    {isSuggesting ? (
                                        <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">refresh</span>
                                    )}
                                    Refresh Suggestions
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {isSuggesting && !suggestedStrategies ? (
                                    <motion.div
                                        key="suggestions-skeleton"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {[1, 2].map((i) => (
                                            <div key={i} className="glass-card rounded-xl p-6 h-48 bg-white/5 border-white/10 space-y-4">
                                                <div className="flex justify-between">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-6 w-32 bg-white/10" />
                                                        <Skeleton className="h-4 w-24 bg-white/5" />
                                                    </div>
                                                    <div className="text-right space-y-2">
                                                        <Skeleton className="h-6 w-16 bg-white/10 ml-auto" />
                                                        <Skeleton className="h-3 w-12 bg-white/5 ml-auto" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-4 w-full bg-white/5" />
                                                <Skeleton className="h-4 w-3/4 bg-white/5" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-8 w-full bg-white/5 rounded-lg" />
                                                    <Skeleton className="h-8 w-8 bg-white/5 rounded-lg" />
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : suggestedStrategies && suggestedStrategies.chains ? (
                                    <motion.div
                                        key="suggestions-content"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`grid grid-cols-1 md:grid-cols-2 gap-4 relative transition-all duration-300 ${isSuggesting ? 'opacity-40 blur-[2px] pointer-events-none' : ''}`}
                                    >
                                        {isSuggesting && (
                                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/5 rounded-2xl">
                                                <div className="w-10 h-10 border-4 border-accent-neon/20 border-t-accent-neon rounded-full animate-spin mb-4"></div>
                                                <p className="text-accent-neon font-bold animate-pulse tracking-widest uppercase text-xs">Analyzing Markets...</p>
                                            </div>
                                        )}
                                        {suggestedStrategies.chains.map((strategy) => (
                                            <div
                                                key={strategy.id}
                                                onClick={() => handleSelectStrategy(strategy, false)}
                                                className="glass-card group relative p-6 rounded-xl hover:border-accent-neon/50 cursor-pointer transition-all hover:bg-white/[0.02]"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-black text-white group-hover:text-accent-neon transition-colors line-clamp-1">{strategy.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${strategy.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                                                strategy.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                                                    'bg-red-500/10 text-red-500'
                                                                }`}>
                                                                {strategy.riskLevel} risk
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 uppercase font-black">{strategy.allocations.length} Protocols</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-accent-neon font-mono">{strategy.estimatedApyMin}-{strategy.estimatedApyMax}%</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Est. APY</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
                                                    {strategy.description}
                                                </p>
                                                <div className="flex items-center gap-1 overflow-hidden">
                                                    {strategy.allocations.map((alloc, idx) => (
                                                        <div key={idx} className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 bg-white/5 py-1.5 px-2 rounded border border-white/5 group-hover:border-white/10">
                                                                <div className="size-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-black text-white">
                                                                    {alloc.assetSymbol[0]}
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-[9px] font-bold text-slate-300 truncate">{alloc.assetSymbol}</span>
                                                                    <span className="text-[8px] text-slate-500 uppercase truncate">{alloc.percentage}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectStrategy(strategy, true);
                                                        }}
                                                        className="size-8 rounded-lg bg-accent-neon text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform active:scale-95 z-20"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => handleRunSimulation()}
                                    disabled={isSimulating}
                                    className={`flex-1 py-4 bg-accent-neon rounded-xl font-bold text-black text-lg transition-all flex items-center justify-center gap-2 min-h-[60px] ${isSimulating ? 'opacity-90 cursor-not-allowed bg-white/5 border border-white/10 text-white' : 'hover:shadow-[0_0_40px_rgba(0,255,163,0.3)] hover:scale-[1.01]'}`}
                                >
                                    {isSimulating ? (
                                        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8 py-2 gap-3 h-full">
                                            <div className="flex flex-col sm:flex-row items-center justify-between w-full h-full gap-3 sm:gap-6">
                                                <div className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-1/2">
                                                    <div className="w-5 h-5 border-2 border-accent-neon/20 border-t-accent-neon rounded-full animate-spin shrink-0"></div>
                                                    <motion.span
                                                        key={currentStepIndex}
                                                        initial={{ opacity: 0, x: -5 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="text-sm font-bold text-slate-300 w-full text-center sm:text-left truncate block min-w-0"
                                                    >
                                                        {simulationSteps[currentStepIndex] || "Processing..."}
                                                    </motion.span>
                                                </div>
                                                <div className="w-full sm:w-1/2 max-w-sm h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 mt-1 sm:mt-0">
                                                    <motion.div
                                                        className="h-full bg-accent-neon"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.max(5, ((currentStepIndex) / (simulationSteps.length || 1)) * 100)}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">play_arrow</span>
                                            Run Simulation
                                        </>
                                    )}
                                </button>
                                {!suggestedStrategies && (
                                    <button
                                        onClick={() => handleSuggestStrategies(false)}
                                        disabled={isSuggesting || isSimulating}
                                        className={`px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2 justify-center ${isSuggesting || isSimulating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {isSuggesting ? (
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin text-slate-300"></span>
                                            </div>
                                        ) : (
                                            <>Get AI Recommendations <span className="material-symbols-outlined text-sm">auto_awesome</span></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </section>

                        {(simulationResult || isSimulating) && (
                            <section id="simulation-results" className="space-y-8 pt-8 relative min-h-[800px]">
                                <div className="flex items-center gap-2 px-1">
                                    <span className="material-symbols-outlined text-accent-neon">analytics</span>
                                    <h2 className="text-xl font-bold text-white">Simulation Results</h2>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isSimulating && !simulationResult ? (
                                        <motion.div
                                            key="loading-results-initial"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="glass-card rounded-xl p-6 h-32 bg-white/5 border-white/10">
                                                        <Skeleton className="h-4 w-20 mb-3 bg-white/10" />
                                                        <Skeleton className="h-10 w-32 bg-white/5" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="glass-card rounded-xl p-6 md:p-8 h-96 bg-white/5 border-white/10 space-y-6">
                                                <div className="flex justify-between">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-6 w-48 bg-white/10" />
                                                        <Skeleton className="h-4 w-64 bg-white/5" />
                                                    </div>
                                                    <Skeleton className="h-8 w-32 bg-white/5 rounded-lg" />
                                                </div>
                                                <Skeleton className="h-full w-full bg-white/5 rounded-lg" />
                                            </div>
                                            <div className="glass-card rounded-xl h-64 bg-white/5 border-white/10">
                                                <div className="p-6 border-b border-white/5">
                                                    <Skeleton className="h-6 w-48 bg-white/10" />
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="flex items-center justify-between">
                                                            <Skeleton className="h-4 w-32 bg-white/5" />
                                                            <Skeleton className="h-4 w-24 bg-white/5" />
                                                            <Skeleton className="h-2 w-32 bg-white/5 rounded-full" />
                                                            <Skeleton className="h-4 w-16 bg-white/5 rounded" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : simulationResult ? (
                                        <motion.div
                                            key="results-content"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: showSuccessPulse ? [1, 1.02, 1] : 1
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                scale: { duration: 0.4, ease: "easeOut" }
                                            }}
                                            className={`space-y-8 relative transition-all duration-300 ${isSimulating ? 'opacity-40 blur-sm pointer-events-none' : ''}`}
                                        >
                                            {isSimulating && (
                                                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/5 rounded-3xl">
                                                    <div className="w-12 h-12 border-4 border-accent-neon/20 border-t-accent-neon rounded-full animate-spin mb-4"></div>
                                                    <p className="text-accent-neon font-bold animate-pulse tracking-widest uppercase text-sm">Simulating...</p>
                                                </div>
                                            )}

                                            {showSuccessPulse && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: [0, 0.3, 0], scale: [0.95, 1.05, 1.1] }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-accent-neon z-50 shadow-[0_0_100px_rgba(0,255,163,0.3)]"
                                                />
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                                                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-card-dark to-[#0F2A14] border-accent-neon/30 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-accent-neon/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Final Value</p>
                                                    <p className="text-4xl font-black neon-text font-mono relative z-10">
                                                        ${simulationResult.summary.finalAmountUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                    </p>
                                                    <p className="text-xs text-accent-neon mt-2 flex items-center gap-1 relative z-10">
                                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                                        +${simulationResult.summary.totalReturnUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} profit
                                                    </p>
                                                </div>
                                                <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Return</p>
                                                    <p className="text-4xl font-black text-white font-mono relative z-10">+{simulationResult.summary.totalReturnPercent.toFixed(2)}%</p>
                                                    <p className="text-xs text-slate-500 mt-2 relative z-10">vs. +{hodlReturnPercent.toFixed(1)}% HODL</p>
                                                </div>
                                                <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Net APY</p>
                                                    <p className="text-4xl font-black text-white font-mono relative z-10">{simulationResult.summary.annualizedApyPercent.toFixed(2)}%</p>
                                                    <p className="text-xs text-slate-500 mt-2 relative z-10">Annualized over {simulationResult.summary.durationDays} days</p>
                                                </div>
                                                <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">IL & Fees</p>
                                                    <p className={`text-4xl font-black font-mono relative z-10 ${simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                                        ${Math.abs(simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) + simulationResult.summary.xcmFeesPaidUsd).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-2 relative z-10">Historical variance & Overheads</p>
                                                </div>
                                            </div>

                                            {/* Chart Rendering */}
                                            <div className="glass-card rounded-xl p-6 md:p-8 space-y-8">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">Portfolio Performance</h3>
                                                        <p className="text-sm text-slate-500">
                                                            Simulated strategy {chartMetric === "value" ? "value ($)" : "yield (%)"} over {simulationResult.summary.durationDays} days
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

                                                <div
                                                    ref={chartContainerRef}
                                                    onMouseMove={handleChartMouseMove}
                                                    onMouseLeave={() => setHoveredPoint(null)}
                                                    className="relative w-full h-80 rounded-lg overflow-hidden flex items-end cursor-crosshair group/chart"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                        <div className="w-full h-[1px] bg-emerald-900 border-dashed"></div>
                                                    </div>

                                                    <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                                                        <defs>
                                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                                <stop offset="0%" stopColor={chartMetric === "value" ? "#00FFA3" : "#A855F7"} stopOpacity="0.4" />
                                                                <stop offset="100%" stopColor={chartMetric === "value" ? "#00FFA3" : "#A855F7"} stopOpacity="0" />
                                                            </linearGradient>
                                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                                <feGaussianBlur stdDeviation="5" result="blur" />
                                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                            </filter>
                                                        </defs>

                                                        {/* Fill Area for main line */}
                                                        <motion.path
                                                            key={`fill-${chartMetric}`}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 1 }}
                                                            d={`${generateChartPath(simulationResult.timeSeries, chartMetric === 'value' ? 'totalValueUsd' : 'dailyReturnPct')} L1000,300 L0,300 Z`}
                                                            fill="url(#chartGradient)"
                                                        />

                                                        {/* HODL Line */}
                                                        <motion.path
                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                            transition={{ duration: 2, ease: "easeInOut" }}
                                                            d={generateChartPath(simulationResult.timeSeries, chartMetric === 'value' ? 'totalValueUsd' : 'dailyReturnPct', true)}
                                                            fill="none"
                                                            stroke="#64748b"
                                                            strokeDasharray="8 4"
                                                            strokeWidth="2"
                                                        />

                                                        {/* Main Line */}
                                                        <motion.path
                                                            key={`line-${chartMetric}`}
                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                                            d={generateChartPath(simulationResult.timeSeries, chartMetric === 'value' ? 'totalValueUsd' : 'dailyReturnPct')}
                                                            fill="none"
                                                            stroke={chartMetric === "value" ? "#00FFA3" : "#A855F7"}
                                                            strokeWidth="3"
                                                            filter="url(#glow)"
                                                        />

                                                        {/* Interactivity elements */}
                                                        <AnimatePresence>
                                                            {hoveredPoint !== null && (
                                                                <motion.g
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                >
                                                                    {/* Crosshair Line */}
                                                                    <line
                                                                        x1={(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 1000}
                                                                        y1="0"
                                                                        x2={(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 1000}
                                                                        y2="300"
                                                                        stroke="rgba(255,255,255,0.1)"
                                                                        strokeWidth="1"
                                                                        strokeDasharray="4 4"
                                                                    />

                                                                    {/* Glowing Dot */}
                                                                    <circle
                                                                        cx={(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 1000}
                                                                        cy={300 - (chartMetric === 'value'
                                                                            ? (simulationResult.timeSeries[hoveredPoint].totalValueUsd / Math.max(...simulationResult.timeSeries.map(p => p.totalValueUsd))) * 250
                                                                            : ((simulationResult.timeSeries[hoveredPoint].dailyReturnPct - Math.min(...simulationResult.timeSeries.map(p => p.dailyReturnPct))) / (Math.max(...simulationResult.timeSeries.map(p => p.dailyReturnPct)) - Math.min(...simulationResult.timeSeries.map(p => p.dailyReturnPct)) || 1)) * 250) - 25}
                                                                        r="6"
                                                                        fill={chartMetric === "value" ? "#00FFA3" : "#A855F7"}
                                                                        filter="url(#glow)"
                                                                    />
                                                                </motion.g>
                                                            )}
                                                        </AnimatePresence>
                                                    </svg>

                                                    {/* Tooltip */}
                                                    <AnimatePresence>
                                                        {hoveredPoint !== null && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute z-50 pointer-events-none glass-card p-3 rounded-lg border-white/10 shadow-2xl"
                                                                style={{
                                                                    left: `${(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 100}%`,
                                                                    bottom: '40%',
                                                                    transform: `translateX(${hoveredPoint > simulationResult.timeSeries.length / 2 ? '-110%' : '10%'})`
                                                                }}
                                                            >
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                                                                    {format(new Date(simulationResult.timeSeries[hoveredPoint].date), 'MMM dd, yyyy')}
                                                                </p>
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <span className="text-xs text-slate-300">Strategy</span>
                                                                        <span className={`text-sm font-bold ${chartMetric === 'value' ? 'neon-text' : 'text-purple-400'}`}>
                                                                            {chartMetric === 'value'
                                                                                ? `$${simulationResult.timeSeries[hoveredPoint].totalValueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                                                                                : `${simulationResult.timeSeries[hoveredPoint].dailyReturnPct.toFixed(2)}%`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <div className="absolute bottom-4 right-8 flex gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full transition-colors ${chartMetric === "value" ? 'bg-accent-neon' : 'bg-purple-500'}`}></div>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                                Simulation
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HODL</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                                    <h3 className="text-lg font-bold text-white">Component Breakdown</h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                        <span className="w-2 h-2 rounded-full bg-accent-neon"></span>
                                                        Live Data Sync
                                                    </div>
                                                </div>
                                                <div className="overflow-x-auto custom-scrollbar">
                                                    <table className="w-full text-left text-sm border-collapse">
                                                        <thead>
                                                            <tr className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                                                <th className="px-6 py-4">Component</th>
                                                                <th className="px-6 py-4">Absolute Gain / Cost</th>
                                                                <th className="px-6 py-4">Trend (90d)</th>
                                                                <th className="px-6 py-4">Efficiency Weight</th>
                                                                <th className="px-6 py-4 text-right">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {simulationResult.breakdown.map((item, idx) => (
                                                                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors relative">
                                                                    <td className="px-6 py-4 font-medium text-white">
                                                                        <div className="flex flex-col">
                                                                            <span className="group-hover:text-accent-neon transition-colors">Total Yield ({item.assetSymbol})</span>
                                                                            <span className="text-xs text-slate-500 font-normal">Protocol: {item.protocol.toUpperCase()}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-accent-neon font-mono font-bold">
                                                                        +${item.returnUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="w-20 h-8">
                                                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                                                                                <motion.path
                                                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                                                    animate={{ pathLength: 1, opacity: 1 }}
                                                                                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                                                                                    d={generateSparklinePath(simulationResult.timeSeries, 'totalValueUsd')}
                                                                                    fill="none"
                                                                                    stroke="#00FFA3"
                                                                                    strokeWidth="1.5"
                                                                                    strokeLinecap="round"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: `${80 + (idx * 5)}%` }}
                                                                                    transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                                                                                    className="h-full bg-accent-neon shadow-[0_0_10px_rgba(0,255,163,0.5)]"
                                                                                ></motion.div>
                                                                            </div>
                                                                            <span className="text-[10px] font-mono text-slate-500">{80 + (idx * 5)}%</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-neon/10 text-accent-neon text-[10px] font-black uppercase tracking-wider border border-accent-neon/20">
                                                                            <span className="w-1 h-1 rounded-full bg-accent-neon animate-pulse"></span>
                                                                            Harvested
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                            {simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) !== 0 && (
                                                                <tr className="group hover:bg-white/[0.02] transition-colors relative">
                                                                    <td className="px-6 py-4 font-medium text-white">
                                                                        <span className="group-hover:text-red-400 transition-colors">Impermanent Loss</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-red-400 font-mono font-bold">
                                                                        -${Math.abs(simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="w-20 h-8 opacity-50">
                                                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                                                                                <motion.path
                                                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                                                    animate={{ pathLength: 1, opacity: 1 }}
                                                                                    transition={{ duration: 1.5, delay: 0.8 }}
                                                                                    d="M0,5 L20,15 L40,8 L60,18"
                                                                                    fill="none"
                                                                                    stroke="#F87171"
                                                                                    strokeWidth="1.5"
                                                                                    strokeLinecap="round"
                                                                                    strokeDasharray="2 2"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: "12%" }}
                                                                                    transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                                                                                    className="h-full bg-red-400"
                                                                                ></motion.div>
                                                                            </div>
                                                                            <span className="text-[10px] font-mono text-slate-500">12%</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-400/20">
                                                                            Managed
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )}

                                                            {simulationResult.summary.xcmFeesPaidUsd > 0 && (
                                                                <tr className="group hover:bg-white/[0.02] transition-colors relative">
                                                                    <td className="px-6 py-4 font-medium text-white">XCM Gas Overhead</td>
                                                                    <td className="px-6 py-4 text-slate-400 font-mono font-bold">-${simulationResult.summary.xcmFeesPaidUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                                    <td className="px-6 py-4">—</td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: "5%" }}
                                                                                    transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                                                                                    className="h-full bg-slate-400"
                                                                                ></motion.div>
                                                                            </div>
                                                                            <span className="text-[10px] font-mono text-slate-500">5%</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-slate-400 text-[10px] font-black uppercase tracking-wider border border-white/20 text-xs">
                                                                            Deducted
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </section>
                        )}

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

            {/* Strategy Detail Modal */}
            <AnimatePresence>
                {selectedStrategyForModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedStrategyForModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-xl font-black text-white">{selectedStrategyForModal.title}</h2>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${selectedStrategyForModal.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                            selectedStrategyForModal.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {selectedStrategyForModal.riskLevel} risk
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{selectedStrategyForModal.description}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedStrategyForModal(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">

                                <div className="space-y-4">
                                    <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4">Allocation Details</h3>

                                    {selectedStrategyForModal.allocations.map((alloc, idx) => (
                                        <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative overflow-hidden group">
                                            {/* Accent left border */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center font-black text-white text-lg border border-white/10 shadow-inner">
                                                        {alloc.assetSymbol[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                            {alloc.assetSymbol}
                                                            {alloc.network && (
                                                                <span className="text-[10px] font-medium bg-white/10 px-1.5 py-0.5 rounded text-slate-300 capitalize">{alloc.network}</span>
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{alloc.protocol} • <span className="text-slate-500">{alloc.poolType}</span></p>
                                                    </div>
                                                </div>
                                                <div className="sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                                                    <div className="text-2xl font-black text-accent-neon font-mono">{alloc.percentage}%</div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Portfolio Allocation</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mt-4 pt-4 border-t border-white/5">
                                                <div className="bg-white/5 p-3 rounded-lg">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-slate-400">monitoring</span>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">APY Range</p>
                                                    </div>
                                                    <p className="font-mono text-sm font-medium text-white">{alloc.apyMin}% - {alloc.apyMax}%</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-lg">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-slate-400">moving</span>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Current APY</p>
                                                    </div>
                                                    <p className="font-mono text-sm font-medium text-white">{alloc.currentApy ? `${alloc.currentApy.toFixed(2)}%` : '-'}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-lg">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-slate-400">account_balance</span>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">TVL (USD)</p>
                                                    </div>
                                                    <p className="font-mono text-sm font-medium text-white">
                                                        {alloc.tvlUsd ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(alloc.tvlUsd) : '-'}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-lg">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-slate-400">update</span>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Last Updated</p>
                                                    </div>
                                                    <p className="text-xs text-slate-300">
                                                        {alloc.dataTimestamp ? format(new Date(alloc.dataTimestamp), "MMM dd, yyyy HH:mm") : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 border-t border-white/5 bg-black/40 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                                <button
                                    onClick={() => setSelectedStrategyForModal(null)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors w-full sm:w-auto text-center"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedStrategyForModal.allocations.length > 0) {
                                            const first = selectedStrategyForModal.allocations[0];
                                            setNetwork(first.protocol);
                                            setProtocol(first.poolType);
                                            const matchedToken = fetchedTokens.find(t => t.symbol === first.assetSymbol);
                                            if (matchedToken) setTokenA(matchedToken);
                                        }
                                        setSelectedStrategyForModal(null);
                                        setToastState({ message: `Strategy "${selectedStrategyForModal.title}" parameters applied!`, type: "success" });
                                    }}
                                    className="px-6 py-3 rounded-xl font-bold bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10 w-full sm:w-auto flex justify-center items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">tune</span>
                                    Apply Parameters
                                </button>
                                <button
                                    onClick={() => {
                                        const strategy = selectedStrategyForModal;
                                        setSelectedStrategyForModal(null);
                                        handleSelectStrategy(strategy, true);
                                    }}
                                    className="px-6 py-3 rounded-xl font-bold bg-accent-neon text-black hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                    Run Simulation
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

