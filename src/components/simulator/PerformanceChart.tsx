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
    const color = chartMetric === "value" ? "#4CAF50" : "#8B5CF6";
    const initialAmount = simulationResult.summary.initialAmountUsd;

    const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!chartContainerRef.current || simulationResult.timeSeries.length === 0) return;
        const rect = chartContainerRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setHoveredPoint(Math.round(percent * (simulationResult.timeSeries.length - 1)));
    };

    return (
        <div className="clay-card rounded-clay-lg p-6 md:p-8 lg:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black font-display text-slate-800">Portfolio Performance</h3>
                    <p className="text-sm font-bold text-slate-400">
                        Simulated strategy {chartMetric === "value" ? "value ($)" : "yield (%)"} over {simulationResult.summary.durationDays} days
                    </p>
                </div>
                <div className="flex items-center gap-2 clay-inset p-1.5 rounded-2xl">
                    <button
                        onClick={() => setChartMetric("value")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${chartMetric === "value" ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Value ($)
                    </button>
                    <button
                        onClick={() => setChartMetric("yield")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${chartMetric === "yield" ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Yield (%)
                    </button>
                </div>
            </div>

            <div
                ref={chartContainerRef}
                onMouseMove={handleChartMouseMove}
                onMouseLeave={() => setHoveredPoint(null)}
                className="relative w-full h-[400px] clay-inset rounded-[3rem] p-0 md:p-8 overflow-hidden flex items-end cursor-crosshair group/chart"
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-full h-[1px] bg-primary/30 border-dashed"></div>
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
                        stroke="#ffffff"
                        strokeDasharray="8 4"
                        strokeWidth="3"
                        strokeOpacity="0.8"
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
                            className="absolute z-50 pointer-events-none clay-button-tactile p-4 rounded-2xl flex flex-col gap-1"
                            style={{
                                left: `${(hoveredPoint / (simulationResult.timeSeries.length - 1)) * 100}%`,
                                bottom: '40%',
                                transform: `translateX(${hoveredPoint > simulationResult.timeSeries.length / 2 ? '-110%' : '10%'})`
                            }}
                        >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                {format(new Date(simulationResult.timeSeries[hoveredPoint].date), 'MMM dd, yyyy')}
                            </p>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-bold text-slate-800">Strategy</span>
                                    <span className={`text-sm font-black ${chartMetric === 'value' ? 'text-primary' : 'text-violet-500'}`}>
                                        {chartMetric === 'value'
                                            ? `$${simulationResult.timeSeries[hoveredPoint].totalValueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                                            : `${simulationResult.timeSeries[hoveredPoint].dailyReturnPct.toFixed(2)}%`}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-6 right-10 flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full shadow-sm transition-colors ${chartMetric === "value" ? 'bg-primary' : 'bg-violet-500'}`}></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Simulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white shadow-sm border border-slate-200"></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HODL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
