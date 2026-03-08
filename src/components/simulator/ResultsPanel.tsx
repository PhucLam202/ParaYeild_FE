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

                        {/* Metrics Cards */}
                        {(() => {
                            const totalIlAndFees = Math.abs(
                                simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) +
                                simulationResult.summary.xcmFeesPaidUsd +
                                (simulationResult.summary.slippageCostUsd ?? 0)
                            );
                            const returnVsHodl = simulationResult.summary.totalReturnPercent - HODL_RETURN_PERCENT;
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                                    {/* Final Value */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                                        className="glass-card rounded-xl p-6 bg-gradient-to-br from-card-dark to-[#0F2A14] border-accent-neon/30 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent-neon opacity-60" />
                                        <div className="absolute inset-0 bg-accent-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">Final Value</p>
                                        <p className="text-3xl font-black neon-text font-mono relative z-10">
                                            ${simulationResult.summary.finalAmountUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-accent-neon relative z-10">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            +${simulationResult.summary.totalReturnUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })} profit
                                        </div>
                                    </motion.div>

                                    {/* Total Return */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                        className="glass-card rounded-xl p-6 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#60A5FA] opacity-60" />
                                        <div className="absolute inset-0 bg-white/3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">Total Return</p>
                                        <p className="text-3xl font-black text-white font-mono relative z-10">+{simulationResult.summary.totalReturnPercent.toFixed(2)}%</p>
                                        <div className={`mt-2 flex items-center gap-1 text-xs relative z-10 ${returnVsHodl >= 0 ? "text-accent-neon" : "text-red-400"}`}>
                                            {returnVsHodl >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                            {returnVsHodl >= 0 ? "+" : ""}{returnVsHodl.toFixed(1)}% vs HODL
                                        </div>
                                    </motion.div>

                                    {/* Net APY */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        className="glass-card rounded-xl p-6 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#A78BFA] opacity-60" />
                                        <div className="absolute inset-0 bg-white/3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">Net APY</p>
                                        <p className="text-3xl font-black text-white font-mono relative z-10">{simulationResult.summary.annualizedApyPercent.toFixed(2)}%</p>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 relative z-10">
                                            <Minus className="w-3 h-3" />
                                            Over {simulationResult.summary.durationDays} days
                                        </div>
                                    </motion.div>

                                    {/* IL & Fees */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        className="glass-card rounded-xl p-6 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FB923C] opacity-60" />
                                        <div className="absolute inset-0 bg-white/3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">IL & Fees</p>
                                        <p className="text-3xl font-black text-red-400 font-mono relative z-10">
                                            -${totalIlAndFees.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 relative z-10">
                                            <TrendingDown className="w-3.5 h-3.5 text-red-400/60" />
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
