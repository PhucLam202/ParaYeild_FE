"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
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
    StrategyFlowTimeline,
} from "@/components/simulator";
import { useSimulation } from "@/hooks/useSimulation";
import type { SuggestedStrategy, StrategyAction } from "@/types/simulator";

function SimulatorPageContent() {
    const sim = useSimulation();
    const [showProAdvanced, setShowProAdvanced] = React.useState(false);

    React.useEffect(() => {
        if (!sim.isProMode && showProAdvanced) {
            setShowProAdvanced(false);
        }
    }, [sim.isProMode, showProAdvanced]);

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

    const applyStrategyPreset = (presetSteps: Array<{ action: StrategyAction; percentage: number }>) => {
        const assetSymbol = sim.isPairProtocol ? `${sim.tokenA.symbol}-${sim.tokenB.symbol}` : sim.tokenA.symbol;
        sim.setStrategySteps(
            presetSteps.map((step) => ({
                id: Math.random().toString(36).slice(2, 11),
                action: step.action,
                percentage: step.percentage,
                asset: assetSymbol,
                protocol: sim.protocol,
            }))
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-primary/30 selection:text-primary relative overflow-hidden antialiased">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
                <div className="absolute left-[10%] top-[-5%] -z-10 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]"></div>
                <div className="absolute right-[5%] bottom-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[100px]"></div>
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-emerald-300/10 blur-[150px] pointer-events-none"></div>
            </div>

            <AnimatePresence>
                {sim.toastState && (
                    <Toast
                        message={sim.toastState.message}
                        type={sim.toastState.type as "success" | "error" | "info" | "warning"}
                        onClose={() => sim.setToastState(null)}
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col min-h-screen">
                <HeaderSection />
                <div className="pt-32 pb-10 flex-grow">
                    <main className="mx-auto max-w-[1480px] px-4 space-y-10">

                        {/* Hero Section */}
                        <section className="space-y-4 text-center md:text-left">
                            <div className="inline-flex flex-row items-center justify-center space-x-2 bg-white px-4 py-2 rounded-full mb-4 shadow-sm border border-slate-100">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(76,175,80,0.6)] animate-pulse"></span>
                                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Simulator Beta</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-800 lg:leading-[1.08]">
                                Pro-Grade DeFi <br />
                                <span className="text-primary relative inline-block">
                                    Backtesting Engine
                                    <svg className="absolute -bottom-2 right-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,10 100,2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed mx-auto md:mx-0 font-medium pb-6 border-b border-slate-200">
                                Simulate historical performance across Polkadot parachains. Optimize your yield strategies with high-precision XCM fee modeling and real-world slippage estimation.
                            </p>
                        </section>

                        <section id="simulation-config" className="space-y-6 scroll-mt-36">
                            <div className="flex items-center gap-3 px-1 pb-2 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">tune</span>
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold font-display text-slate-800 leading-none">Configure Simulation</h2>
                                    <p className="text-xs text-slate-500 mt-1 font-bold">Select network, tokens, and parameters</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="clay-card rounded-clay-lg p-5 lg:p-8 space-y-8 md:col-span-2 relative z-20">
                                    <AnimatePresence mode="wait">
                                        {sim.isLoadingInitial ? (
                                            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="space-y-2">
                                                            <Skeleton className="h-4 w-24 bg-slate-200" />
                                                            <Skeleton className="h-14 w-full bg-slate-100/50 rounded-2xl" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32 bg-slate-200" />
                                                        <Skeleton className="h-14 w-full bg-slate-100/50 rounded-2xl" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-24 bg-slate-200" />
                                                        <Skeleton className="h-14 w-full bg-slate-100/50 rounded-2xl" />
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
                                                        selectedPool={sim.selectedPool}
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
                                                    // Pro Mode
                                                    isProMode={sim.isProMode}
                                                    setIsProMode={sim.setIsProMode}
                                                    showAdvancedOptions={showProAdvanced}
                                                    setShowAdvancedOptions={setShowProAdvanced}
                                                    isBaseApyOverrideEnabled={sim.isBaseApyOverrideEnabled}
                                                    setIsBaseApyOverrideEnabled={sim.setIsBaseApyOverrideEnabled}
                                                    baseApyOverride={sim.baseApyOverride}
                                                    setBaseApyOverride={sim.setBaseApyOverride}
                                                    reinvestmentRate={sim.reinvestmentRate}
                                                    setReinvestmentRate={sim.setReinvestmentRate}
                                                    compoundFrequency={sim.compoundFrequency}
                                                    setCompoundFrequency={sim.setCompoundFrequency}
                                                    volatilityAssumption={sim.volatilityAssumption}
                                                    setVolatilityAssumption={sim.setVolatilityAssumption}
                                                    maxAcceptableIl={sim.maxAcceptableIl}
                                                    setMaxAcceptableIl={sim.setMaxAcceptableIl}
                                                    priceRange={sim.priceRange}
                                                    setPriceRange={sim.setPriceRange}
                                                    historicalApyAverage={sim.historicalApyAverage}
                                                    strategyStepCount={sim.strategySteps.length}
                                                />

                                                {sim.isProMode && showProAdvanced && (
                                                    <StrategyFlowTimeline
                                                        steps={sim.strategySteps}
                                                        addStep={(action) => sim.addStrategyStep({
                                                            action,
                                                            percentage: 20,
                                                            asset: sim.isPairProtocol ? `${sim.tokenA.symbol}-${sim.tokenB.symbol}` : sim.tokenA.symbol,
                                                            protocol: sim.protocol
                                                        })}
                                                        applyPreset={applyStrategyPreset}
                                                        clearSteps={() => sim.setStrategySteps([])}
                                                        removeStep={sim.removeStrategyStep}
                                                        updateStep={sim.updateStrategyStep}
                                                        reorderSteps={sim.reorderStrategySteps}
                                                    />
                                                )}
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
                            handleRunSimulation={sim.handleRunSimulation}
                            handleSuggestStrategies={sim.handleSuggestStrategies}
                            handleSelectStrategy={sim.handleSelectStrategy}
                            setIsProMode={sim.setIsProMode}
                        />

                        {/* Simulation Results */}
                        <ResultsPanel
                            simulationResult={sim.simulationResult}
                            isSimulating={sim.isSimulating}
                            showSuccessPulse={sim.showSuccessPulse}
                            chartMetric={sim.chartMetric}
                            setChartMetric={sim.setChartMetric}
                        />

                        {/* Methodology + Related Tools */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-500 text-xl">menu_book</span>
                                    </div>
                                    <h2 className="text-xl font-bold font-display text-slate-800">Methodology</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="clay-card rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all">
                                        <span className="text-sm text-slate-700 font-bold">How we calculate XCM fee modeling?</span>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add</span>
                                        </div>
                                    </div>
                                    <div className="clay-card rounded-2xl p-5 flex flex-col justify-between group cursor-pointer bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-primary font-black">Protocol Slippage Assumptions</span>
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">remove</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium pb-2 border-b border-slate-100">
                                            We use a dynamic orderbook snapshot from the selected historical timestamp to calculate real-world execution price impact based on your trade size.
                                        </p>
                                    </div>
                                </div>
                                <div className="clay-card border-l-4 border-l-orange-400 p-6 rounded-2xl rounded-l-none space-y-3 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex items-center gap-2 text-orange-500 relative z-10">
                                        <span className="material-symbols-outlined">warning</span>
                                        <span className="text-xs font-black uppercase tracking-widest">Risk Disclaimer</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                                        Backtesting is based on historical data and does not guarantee future results. DeFi protocols are subject to smart contract risks, liquidity crunches, and rapid market fluctuations. Simulation results do not include tax implications.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-500 text-xl">extension</span>
                                    </div>
                                    <h2 className="text-xl font-bold font-display text-slate-800">Related Tools</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-5">
                                    <a className="clay-button-tactile p-6 rounded-2xl group flex flex-col transition-all text-left" href="#">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-primary group-hover:text-white">waves</span>
                                        </div>
                                        <h4 className="text-slate-800 font-black mb-2 font-display text-lg">Pool Analytics</h4>
                                        <p className="text-sm text-slate-500 font-medium">Deep dive into specific parachain liquidity pools.</p>
                                    </a>
                                    <a className="clay-button-tactile p-6 rounded-2xl group flex flex-col transition-all text-left" href="#">
                                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-violet-500 group-hover:text-white">calculate</span>
                                        </div>
                                        <h4 className="text-slate-800 font-black mb-2 font-display text-lg">XCM Fee Calculator</h4>
                                        <p className="text-sm text-slate-500 font-medium">Instant cross-chain transfer cost estimator.</p>
                                    </a>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer className="mt-20 py-12 border-t border-slate-200">
                        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
                            <div className="flex justify-center items-center gap-2 mb-4">
                                <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-[0_4px_10px_rgba(76,175,80,0.3)]">PY</div>
                                <span className="text-sm font-black text-slate-700 tracking-tight font-display">Built by ParaYield Labs</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mb-8">© 2024 ParaYield DeFi Simulator. Not financial advice. Data provided by ecosystem partners.</p>
                            <div className="flex justify-center gap-4">
                                <a className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:-translate-y-1 transition-all" href="#">
                                    <span className="material-symbols-outlined text-xl">public</span>
                                </a>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => {
                                            const headers = "Date,Value,Return%\n";
                                            const rows = sim.simulationResult?.timeSeries.map((d) => `${d.date},${d.totalValueUsd},${d.dailyReturnPct}`).join("\n") || "";
                                            const blob = new Blob([headers + rows], { type: 'text/csv' });
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = 'parayield-simulation.csv';
                                            a.click();
                                        }}
                                        className="w-12 h-12 clay-button-tactile rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                        title="Export CSV"
                                    >
                                        <span className="material-symbols-outlined">download</span>
                                    </button>
                                    <button className="w-12 h-12 clay-button-tactile rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">share</span>
                                    </button>
                                </div>
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

export default function SimulatorPage() {
    const searchParams = useSearchParams();
    const selectionKey = searchParams.toString() || "default";

    return <SimulatorPageContent key={selectionKey} />;
}
