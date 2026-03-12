import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PerformanceChart from "./PerformanceChart";
import BreakdownTable from "./BreakdownTable";
import type { SimulationResponse } from "@/types/simulator";

const HODL_RETURN_PERCENT = 3.5;

interface Props {
    simulationResult: SimulationResponse | null;
    isSimulating: boolean;
    showSuccessPulse: boolean;
    chartMetric: "value" | "yield";
    setChartMetric: (v: "value" | "yield") => void;
    hoveredPoint: number | null;
    setHoveredPoint: (v: number | null) => void;
}

export default function ResultsPanel({
    simulationResult,
    isSimulating,
    showSuccessPulse,
    chartMetric,
    setChartMetric,
    hoveredPoint,
    setHoveredPoint,
}: Props) {
    if (!simulationResult && !isSimulating) return null;

    return (
        <section id="simulation-results" className="clay-card rounded-clay-xl p-6 md:p-10 lg:p-14 space-y-10 relative min-h-[800px] mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-black font-display text-slate-800 tracking-tight">
                        Simulation <span className="text-primary italic">Results</span>
                    </h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Projected Performance Insights</p>
                </div>
                <div className="flex gap-4">
                    <button className="w-12 h-12 clay-button-tactile rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">download</span>
                    </button>
                    <button className="w-12 h-12 clay-button-tactile rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="metric-glow bg-white p-8 rounded-clay space-y-4 flex flex-col items-center justify-center h-40">
                                    <Skeleton className="h-4 w-24 bg-slate-100" />
                                    <Skeleton className="h-10 w-32 bg-slate-200" />
                                </div>
                            ))}
                        </div>
                        <div className="clay-inset rounded-[3rem] p-6 md:p-8 h-96 space-y-6">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-8 w-48 bg-slate-200 rounded-lg" />
                                <Skeleton className="h-10 w-32 bg-slate-200 rounded-xl" />
                            </div>
                            <Skeleton className="h-[250px] w-full bg-slate-100 rounded-2xl" />
                        </div>
                        <div className="metric-glow bg-white rounded-clay p-8">
                            <Skeleton className="h-6 w-48 bg-slate-200 mb-6" />
                            <div className="space-y-5">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full bg-slate-100 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : simulationResult ? (
                    <motion.div
                        key="results-content"
                        initial={{ opacity: 0, y: 32 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: showSuccessPulse ? [1, 1.02, 1] : 1
                        }}
                        transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                            scale: { duration: 0.4, ease: "easeOut" }
                        }}
                        className={`space-y-8 relative transition-all duration-300 ${isSimulating ? 'opacity-40 blur-sm pointer-events-none' : ''}`}
                    >
                        {isSimulating && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[3rem]">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                                <p className="text-primary font-bold animate-pulse tracking-widest uppercase text-sm">Simulating...</p>
                            </div>
                        )}

                        {showSuccessPulse && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: [0, 0.5, 0], scale: [0.95, 1.02, 1.05] }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 pointer-events-none rounded-[3rem] border-2 border-primary z-50 shadow-[0_0_60px_rgba(76,175,80,0.2)]"
                            />
                        )}

                        {/* Metrics Cards */}
                        {(() => {
                            const totalIlAndFees = Math.abs(
                                simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) +
                                simulationResult.summary.xcmFeesPaidUsd +
                                (simulationResult.summary.slippageCostUsd ?? 0)
                            );
                            const returnVsHodl = simulationResult.summary.totalReturnPercent - HODL_RETURN_PERCENT;
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                                    {/* Final Value */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                                        className="metric-glow bg-white p-6 md:p-8 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Final Value</p>
                                        <p className="text-3xl lg:text-4xl font-black font-display text-slate-800">
                                            ${simulationResult.summary.finalAmountUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-primary mt-2">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            +${simulationResult.summary.totalReturnUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })} profit
                                        </div>
                                    </motion.div>

                                    {/* Total Return */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                        className="metric-glow bg-white p-6 md:p-8 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Return</p>
                                        <p className="text-3xl lg:text-4xl font-black font-display text-primary">+{simulationResult.summary.totalReturnPercent.toFixed(2)}%</p>
                                        <div className={`flex items-center justify-center gap-1 text-xs font-bold mt-2 ${returnVsHodl >= 0 ? "text-primary" : "text-clay-red"}`}>
                                            {returnVsHodl >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                            {returnVsHodl >= 0 ? "+" : ""}{returnVsHodl.toFixed(1)}% vs HODL
                                        </div>
                                    </motion.div>

                                    {/* Net APY */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        className="metric-glow bg-white p-6 md:p-8 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Net APY</p>
                                        <p className="text-3xl lg:text-4xl font-black font-display text-primary">{simulationResult.summary.annualizedApyPercent.toFixed(2)}%</p>
                                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400 mt-2">
                                            <Minus className="w-3 h-3" />
                                            Over {simulationResult.summary.durationDays} days
                                        </div>
                                    </motion.div>

                                    {/* IL & Fees */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        className="metric-glow bg-white p-6 md:p-8 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IL & Fees</p>
                                        <p className="text-3xl lg:text-4xl font-black font-display text-clay-red">
                                            -${totalIlAndFees.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400 mt-2">
                                            <TrendingDown className="w-3.5 h-3.5 text-clay-red/60" />
                                            Variance & overhead
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })()}

                        <PerformanceChart
                            simulationResult={simulationResult}
                            chartMetric={chartMetric}
                            setChartMetric={setChartMetric}
                            hoveredPoint={hoveredPoint}
                            setHoveredPoint={setHoveredPoint}
                        />

                        <BreakdownTable simulationResult={simulationResult} />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
}
