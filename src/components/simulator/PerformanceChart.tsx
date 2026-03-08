import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { SimulationResponse, TimeSeriesPoint } from "@/types/simulator";

interface Props {
    simulationResult: SimulationResponse;
    chartMetric: "value" | "yield";
    setChartMetric: (v: "value" | "yield") => void;
    hoveredPoint: number | null;
    setHoveredPoint: (v: number | null) => void;
}

function generateChartPath(
    data: TimeSeriesPoint[],
    key: 'totalValueUsd' | 'dailyReturnPct',
    initialAmount: number,
    isHodl = false
): string {
    if (!data || data.length === 0) return "";
    const width = 1000;
    const height = 300;
    const padding = 20;
    const maxPoints = data.length;
    if (maxPoints < 2) return "";

    let maxVal = -Infinity;
    let minVal = Infinity;
    data.forEach((d, index) => {
        const val = key === 'totalValueUsd'
            ? (isHodl ? initialAmount * (1 + (0.035 * (index / 365))) : d[key])
            : (isHodl ? 3.5 * (index / maxPoints) : d[key]);
        if (val > maxVal) maxVal = val;
        if (val < minVal) minVal = val;
    });

    const range = maxVal - minVal;
    const bufferedMax = maxVal + (range * 0.1) || 1;
    const bufferedMin = minVal - (range * 0.1) || 0;
    const bufferedRange = bufferedMax - bufferedMin;

    return data.map((d, index) => {
        const val = key === 'totalValueUsd'
            ? (isHodl ? initialAmount * (1 + (0.035 * (index / 365))) : d[key])
            : (isHodl ? 3.5 * (index / maxPoints) : d[key]);
        const x = (index / (maxPoints - 1)) * width;
        const y = height - padding - ((val - bufferedMin) / bufferedRange) * (height - 2 * padding);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
}

export default function PerformanceChart({
    simulationResult,
    chartMetric,
    setChartMetric,
    hoveredPoint,
    setHoveredPoint,
}: Props) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const tsKey = chartMetric === 'value' ? 'totalValueUsd' : 'dailyReturnPct';
    const color = chartMetric === "value" ? "#00FFA3" : "#A855F7";
    const initialAmount = simulationResult.summary.initialAmountUsd;

    const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!chartContainerRef.current || simulationResult.timeSeries.length === 0) return;
        const rect = chartContainerRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setHoveredPoint(Math.round(percent * (simulationResult.timeSeries.length - 1)));
    };

    return (
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
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <motion.path
                        key={`fill-${chartMetric}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        d={`${generateChartPath(simulationResult.timeSeries, tsKey, initialAmount)} L1000,300 L0,300 Z`}
                        fill="url(#chartGradient)"
                    />
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={generateChartPath(simulationResult.timeSeries, tsKey, initialAmount, true)}
                        fill="none"
                        stroke="#64748b"
                        strokeDasharray="8 4"
                        strokeWidth="2"
                    />
                    <motion.path
                        key={`line-${chartMetric}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={generateChartPath(simulationResult.timeSeries, tsKey, initialAmount)}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        filter="url(#glow)"
                    />

                    <AnimatePresence>
                        {hoveredPoint !== null && (
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <line
                                    x1={(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 1000}
                                    y1="0"
                                    x2={(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 1000}
                                    y2="300"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 1000}
                                    cy={300 - (chartMetric === 'value'
                                        ? (simulationResult.timeSeries[hoveredPoint].totalValueUsd / Math.max(...simulationResult.timeSeries.map(p => p.totalValueUsd))) * 250
                                        : ((simulationResult.timeSeries[hoveredPoint].dailyReturnPct - Math.min(...simulationResult.timeSeries.map(p => p.dailyReturnPct))) / (Math.max(...simulationResult.timeSeries.map(p => p.dailyReturnPct)) - Math.min(...simulationResult.timeSeries.map(p => p.dailyReturnPct)) || 1)) * 250) - 25}
                                    r="6"
                                    fill={color}
                                    filter="url(#glow)"
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

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
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Simulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HODL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
