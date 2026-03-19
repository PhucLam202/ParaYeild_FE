import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, CalendarRange, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PerformanceChart from "./PerformanceChart";
import BreakdownBarChart from "./BreakdownBarChart";
import BreakdownTable from "./BreakdownTable";
import { Shield } from "lucide-react";
import type { SimulationResponse, ChartMetricType } from "@/types/simulator";

const HODL_RETURN_PERCENT = 3.5;

function formatSignedCurrency(value: number, maximumFractionDigits = 0) {
    const absValue = Math.abs(value).toLocaleString("en-US", { maximumFractionDigits });
    if (value > 0) return `+$${absValue}`;
    if (value < 0) return `-$${absValue}`;
    return `$${absValue}`;
}

function formatSignedPercent(value: number, digits = 2) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toFixed(digits)}%`;
}

function formatSignedPoints(value: number, digits = 1) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toFixed(digits)} pts`;
}

interface Props {
    simulationResult: SimulationResponse | null;
    isSimulating: boolean;
    showSuccessPulse: boolean;
    chartMetric: ChartMetricType;
    setChartMetric: (v: ChartMetricType) => void;
}

export default function ResultsPanel({
    simulationResult,
    isSimulating,
    showSuccessPulse,
    chartMetric,
    setChartMetric,
}: Props) {
    if (!simulationResult && !isSimulating) return null;

    return (
        <section id="simulation-results" className="clay-card rounded-clay-xl p-5 md:p-8 lg:p-10 space-y-8 relative min-h-[720px] mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black font-display text-slate-800 tracking-tight">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="metric-glow bg-white p-6 rounded-clay space-y-4 flex flex-col items-center justify-center h-36">
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
                        <div className="metric-glow bg-white rounded-clay p-6">
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
                        className={`space-y-6 relative transition-all duration-300 ${isSimulating ? 'opacity-40 blur-sm pointer-events-none' : ''}`}
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
                            const firstPoint = simulationResult.timeSeries[0];
                            const lastPoint = simulationResult.timeSeries[simulationResult.timeSeries.length - 1];
                            const hasRiskScore = simulationResult.summary.riskScore != null;
                            const totalIlAndFees = Math.abs(
                                simulationResult.breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) +
                                simulationResult.summary.xcmFeesPaidUsd +
                                (simulationResult.summary.slippageCostUsd ?? 0)
                            );
                            const returnVsHodl = simulationResult.summary.totalReturnPercent - HODL_RETURN_PERCENT;
                            const totalReturnUsd = simulationResult.summary.totalReturnUsd;
                            const totalReturnPercent = simulationResult.summary.totalReturnPercent;
                            const isProfitPositive = totalReturnUsd >= 0;
                            const isReturnPositive = totalReturnPercent >= 0;
                            return (
                                <div className="space-y-5 relative z-10">
                                    <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-4">
                                        <div className="clay-inset rounded-[2rem] p-4 md:p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                    <Info className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                        How To Read This
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                                        <span className="text-slate-900">Period Return</span> is the realized gain for this simulation window.
                                                        <span className="text-slate-500"> Annualized Net APY</span> normalizes that result to a 1-year rate. Taxes are not modeled.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="clay-inset rounded-[2rem] p-4 md:p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-900/[0.04] text-slate-600 flex items-center justify-center shrink-0">
                                                    <CalendarRange className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                        Simulation Window
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {firstPoint && lastPoint
                                                            ? `${format(new Date(firstPoint.date), "MMM dd, yyyy")} -> ${format(new Date(lastPoint.date), "MMM dd, yyyy")}`
                                                            : `${simulationResult.summary.durationDays} simulated days`}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-400">
                                                        {simulationResult.summary.durationDays} historical days evaluated
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${hasRiskScore ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4"} gap-5`}>
                                    {/* Final Value */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                                        className="metric-glow bg-white p-5 md:p-6 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Final Value</p>
                                        <p className="text-2xl lg:text-3xl font-black font-display text-slate-800">
                                            ${simulationResult.summary.finalAmountUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </p>
                                        <div className={`flex items-center justify-center gap-1 text-xs font-bold mt-2 ${isProfitPositive ? "text-primary" : "text-clay-red"}`}>
                                            {isProfitPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                            {formatSignedCurrency(totalReturnUsd)} net change
                                        </div>
                                    </motion.div>

                                    {/* Period Return */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                        className="metric-glow bg-white p-5 md:p-6 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Period Return</p>
                                        <p className={`text-2xl lg:text-3xl font-black font-display ${isReturnPositive ? "text-primary" : "text-clay-red"}`}>
                                            {formatSignedPercent(totalReturnPercent)}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400 mt-2">
                                            <Minus className="w-3 h-3" />
                                            Across {simulationResult.summary.durationDays} simulated days
                                        </div>
                                        <div className={`flex items-center justify-center gap-1 text-xs font-bold mt-1 ${returnVsHodl >= 0 ? "text-primary" : "text-clay-red"}`}>
                                            {returnVsHodl >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                            {formatSignedPoints(returnVsHodl)} vs 3.5% HODL baseline
                                        </div>
                                    </motion.div>

                                    {/* Annualized Net APY */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        className="metric-glow bg-white p-5 md:p-6 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Annualized Net APY</p>
                                        <p className={`text-2xl lg:text-3xl font-black font-display ${simulationResult.summary.annualizedApyPercent >= 0 ? "text-primary" : "text-clay-red"}`}>
                                            {formatSignedPercent(simulationResult.summary.annualizedApyPercent)}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400 mt-2">
                                            <Minus className="w-3 h-3" />
                                            Annualized from the realized {simulationResult.summary.durationDays}-day result
                                        </div>
                                    </motion.div>

                                    {/* IL + Costs */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        className="metric-glow bg-white p-5 md:p-6 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IL + Costs</p>
                                        <p className="text-2xl lg:text-3xl font-black font-display text-clay-red">
                                            -${totalIlAndFees.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400 mt-2">
                                            <TrendingDown className="w-3.5 h-3.5 text-clay-red/60" />
                                            IL, XCM fees, and slippage drag
                                        </div>
                                    </motion.div>

                                    {simulationResult.summary.riskScore != null && (
                                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                            className="metric-glow bg-white p-5 md:p-6 rounded-clay text-center space-y-2 relative overflow-hidden group"
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Risk Score</p>
                                            <p className="text-2xl lg:text-3xl font-black font-display text-slate-800">
                                                {simulationResult.summary.riskScore.toFixed(0)}
                                            </p>
                                            {simulationResult.summary.riskLevel && (
                                                <div className="flex items-center justify-center gap-1.5 mt-2">
                                                    <Shield className={`w-3.5 h-3.5 ${
                                                        simulationResult.summary.riskLevel === 'low' ? 'text-primary' :
                                                        simulationResult.summary.riskLevel === 'medium' ? 'text-amber-500' :
                                                        'text-clay-red'
                                                    }`} />
                                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                        simulationResult.summary.riskLevel === 'low' ? 'bg-primary/10 text-primary' :
                                                        simulationResult.summary.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-red-500/10 text-clay-red'
                                                    }`}>
                                                        {simulationResult.summary.riskLevel}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                                </div>
                            );
                        })()}

                        <PerformanceChart
                            simulationResult={simulationResult}
                            chartMetric={chartMetric}
                            setChartMetric={setChartMetric}
                        />

                        <BreakdownBarChart simulationResult={simulationResult} />

                        <BreakdownTable simulationResult={simulationResult} />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
}
