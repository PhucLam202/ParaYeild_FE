"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Toast from "@/components/ui/Toast";
import HeaderSection from "@/components/layout/HeaderSection";
import {
    NetworkProtocolSelector,
    TokenSelector,
    SimulationParameters,
    StrategySuggestions,
    ResultsPanel,
    StrategyModal,
} from "@/components/simulator";
import { useSimulation, DEFAULT_TOKENS } from "@/hooks/useSimulation";
import type { SuggestedStrategy } from "@/types/simulator";

export default function SimulatorPage() {
    const sim = useSimulation();

    const handleApplyParams = (strategy: SuggestedStrategy) => {
        if (strategy.allocations.length > 0) {
            const first = strategy.allocations[0];
            sim.setNetwork(first.protocol);
            sim.setProtocol(first.poolType);
            const matchedToken = sim.fetchedTokens.find(t => t.symbol === first.assetSymbol);
            if (matchedToken) sim.setTokenA(matchedToken);
        }
        sim.setSelectedStrategyForModal(null);
        sim.setToastState({ message: `Strategy "${strategy.title}" parameters applied!`, type: "success" });
    };

    const handleRunFromModal = (strategy: SuggestedStrategy) => {
        sim.setSelectedStrategyForModal(null);
        sim.handleSelectStrategy(strategy, true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] via-[#121212] to-[#0C0C0C] text-[#f1f1f1] font-sans selection:bg-[#00FFA3] selection:text-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-[20%] top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-neon opacity-[0.07] blur-[120px]"></div>
                <div className="absolute right-[10%] bottom-0 -z-10 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#352F36] opacity-30 blur-[100px]"></div>
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[#2B2B2B] opacity-10 blur-[150px] mix-blend-screen pointer-events-none z-[-1]"></div>
            </div>

            <AnimatePresence>
                {sim.toastState && (
                    <Toast
                        message={sim.toastState.message}
                        type={sim.toastState.type as any}
                        onClose={() => sim.setToastState(null)}
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col min-h-screen">
                <HeaderSection />
                <div className="pt-36 pb-12 flex-grow">
                    <main className="mx-auto max-w-7xl px-4 space-y-12">

                        {/* Hero Section */}
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

                        {/* Configure Simulation */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-1 pb-2 border-b border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-accent-neon/10 border border-accent-neon/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-accent-neon text-base">settings</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-none">Configure Simulation</h2>
                                    <p className="text-xs text-slate-500 mt-0.5 font-mono">Select network, tokens, and parameters</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card rounded-xl p-6 space-y-6 md:col-span-2 relative z-20">
                                    <AnimatePresence mode="wait">
                                        {sim.isLoadingInitial ? (
                                            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
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
                                            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <NetworkProtocolSelector
                                                        network={sim.network}
                                                        setNetwork={sim.setNetwork}
                                                        protocol={sim.protocol}
                                                        setProtocol={sim.setProtocol}
                                                        fetchedParachains={sim.fetchedParachains}
                                                        fetchedProtocols={sim.fetchedProtocols}
                                                    />
                                                    <TokenSelector
                                                        tokenA={sim.tokenA}
                                                        tokenB={sim.tokenB}
                                                        isPairProtocol={sim.isPairProtocol}
                                                        availableTokenAs={sim.availableTokenAs}
                                                        availableTokenBs={sim.availableTokenBs}
                                                        handleTokenAChange={sim.handleTokenAChange}
                                                        handleTokenBChange={sim.handleTokenBChange}
                                                    />
                                                </div>
                                                <SimulationParameters
                                                    amount={sim.amount}
                                                    setAmount={sim.setAmount}
                                                    timeRange={sim.timeRange}
                                                    setTimeRange={sim.setTimeRange}
                                                    customRange={sim.customRange}
                                                    setCustomRange={sim.setCustomRange}
                                                    slippage={sim.slippage}
                                                    setSlippage={sim.setSlippage}
                                                    compoundYield={sim.compoundYield}
                                                    setCompoundYield={sim.setCompoundYield}
                                                    xcmFees={sim.xcmFees}
                                                    setXcmFees={sim.setXcmFees}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </section>

                        {/* AI Suggestions + Run Button */}
                        <StrategySuggestions
                            suggestedStrategies={sim.suggestedStrategies}
                            isSuggesting={sim.isSuggesting}
                            isSimulating={sim.isSimulating}
                            simulationSteps={sim.simulationSteps}
                            currentStepIndex={sim.currentStepIndex}
                            isSimulatingActive={sim.isSimulating}
                            handleRunSimulation={sim.handleRunSimulation}
                            handleSuggestStrategies={sim.handleSuggestStrategies}
                            handleSelectStrategy={sim.handleSelectStrategy}
                        />

                        {/* Simulation Results */}
                        <ResultsPanel
                            simulationResult={sim.simulationResult}
                            isSimulating={sim.isSimulating}
                            showSuccessPulse={sim.showSuccessPulse}
                            chartMetric={sim.chartMetric}
                            setChartMetric={sim.setChartMetric}
                            hoveredPoint={sim.hoveredPoint}
                            setHoveredPoint={sim.setHoveredPoint}
                        />

                        {/* Methodology + Related Tools */}
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
                        <div className="text-center max-w-4xl mx-auto mb-16">
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
            <StrategyModal
                strategy={sim.selectedStrategyForModal}
                fetchedTokens={sim.fetchedTokens}
                onClose={() => sim.setSelectedStrategyForModal(null)}
                onApplyParams={handleApplyParams}
                onRunSimulation={handleRunFromModal}
            />
        </div>
    );
}
