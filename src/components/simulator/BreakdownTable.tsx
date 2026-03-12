import React from "react";
import { motion } from "framer-motion";
import type { SimulationResponse, TimeSeriesPoint } from "@/types/simulator";

interface Props {
    simulationResult: SimulationResponse;
}

function generateSparklinePath(data: TimeSeriesPoint[], key: keyof TimeSeriesPoint): string {
    if (!data || data.length < 2) return "";
    const values = data.map(d => d[key] as number);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return data.map((d, i) => {
        const x = (i / (data.length - 1)) * 60;
        const y = 20 - (((d[key] as number) - min) / range) * 20;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(" ");
}

export default function BreakdownTable({ simulationResult }: Props) {
    const { breakdown, summary, timeSeries } = simulationResult;

    return (
        <div className="clay-inner-card overflow-hidden">
            <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-slate-800">Component Breakdown</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Live Data Sync
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-primary/5 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-primary/10">
                            <th className="px-6 py-4">Component</th>
                            <th className="px-6 py-4">Absolute Gain / Cost</th>
                            <th className="px-6 py-4">Trend (90d)</th>
                            <th className="px-6 py-4">Efficiency Weight</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5 bg-white/30 backdrop-blur-sm">
                        {breakdown.map((item, idx) => {
                            const displayApy = item.avgTotalApyPercent ?? item.avgApyPercent ?? 0;
                            return (
                                <React.Fragment key={idx}>
                                    <tr className="group hover:bg-white/50 transition-colors relative">
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            <div className="flex flex-col">
                                                <span className="group-hover:text-primary transition-colors flex items-center flex-wrap gap-1">
                                                    Total Yield ({item.assetSymbol})
                                                    {item.isFallbackData && (
                                                        <span title={item.warning} className="ml-1 text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded shadow-sm cursor-help">
                                                            Estimated
                                                        </span>
                                                    )}
                                                    {item.hasHistoricalData === false && (
                                                        <span className="text-xs text-red-500 ml-1 bg-red-50 px-1.5 py-0.5 rounded shadow-sm">No historical data — APY: 0%</span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-slate-500 font-normal mt-1">
                                                    Protocol: {item.protocol.toUpperCase()}
                                                    {displayApy > 0 && (
                                                        <span className="ml-2 text-primary/80 font-bold bg-primary/10 px-2 py-0.5 rounded-md">~{displayApy.toFixed(2)}% APY</span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-primary font-mono font-black text-lg">
                                            +${item.returnUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-10 bg-white rounded-lg shadow-sm p-1 border border-slate-100 flex items-end">
                                                <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                                                    <motion.path
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={{ pathLength: 1, opacity: 1 }}
                                                        transition={{ duration: 1.5, delay: idx * 0.1 }}
                                                        d={generateSparklinePath(timeSeries, 'totalValueUsd')}
                                                        fill="none"
                                                        stroke="#4CAF50"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${80 + (idx * 5)}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">{80 + (idx * 5)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm border border-primary/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(76,175,80,0.5)] animate-pulse"></span>
                                                Harvested
                                            </span>
                                        </td>
                                    </tr>
                                    {item.yieldFarmingStats && (
                                        <tr className="bg-white/30 backdrop-blur-sm">
                                            <td colSpan={5} className="px-6 pb-4 pt-0">
                                                <div className="clay-inset rounded-xl p-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-[10px]">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Farm Rewards</span>
                                                        <span className="text-primary font-mono font-black text-sm">+${item.yieldFarmingStats.totalFarmingRewardsEarnedUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Compounded</span>
                                                        <span className="text-slate-800 font-mono font-black text-sm">+${item.yieldFarmingStats.totalCompoundedRewardsUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Unclaimed</span>
                                                        <span className="text-slate-600 font-mono font-bold text-sm">${item.yieldFarmingStats.remainingUnclaimedRewardsUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Harvest Fees</span>
                                                        <span className="text-red-500 font-mono font-bold text-sm">-${item.yieldFarmingStats.harvestFeesPaidUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Harvest Events</span>
                                                        <span className="text-slate-600 font-mono font-bold text-sm">{item.yieldFarmingStats.harvestEventsCount}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) !== 0 && (
                            <tr className="group hover:bg-white/50 transition-colors relative">
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    <span className="group-hover:text-red-500 transition-colors">Impermanent Loss</span>
                                </td>
                                <td className="px-6 py-4 text-red-500 font-mono font-black text-lg">
                                    -${Math.abs(breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-24 h-10 bg-white rounded-lg shadow-sm p-1 border border-slate-100 flex items-end opacity-70">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                                            <motion.path
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ duration: 1.5, delay: 0.8 }}
                                                d="M0,5 L20,15 L40,8 L60,18"
                                                fill="none"
                                                stroke="#ef4444"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeDasharray="2 2"
                                            />
                                        </svg>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "12%" }}
                                                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                                                className="h-full bg-red-400"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">12%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-500 text-[10px] font-black uppercase tracking-wider shadow-sm border border-slate-200">
                                        Managed
                                    </span>
                                </td>
                            </tr>
                        )}

                        {summary.xcmFeesPaidUsd > 0 && (
                            <tr className="group hover:bg-white/50 transition-colors relative">
                                <td className="px-6 py-4 font-bold text-slate-800">XCM Gas Overhead</td>
                                <td className="px-6 py-4 text-slate-500 font-mono font-black text-lg">-${summary.xcmFeesPaidUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4">—</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "5%" }}
                                                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                                                className="h-full bg-slate-400"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">5%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-500 text-[10px] font-black uppercase tracking-wider shadow-sm border border-slate-200">
                                        Deducted
                                    </span>
                                </td>
                            </tr>
                        )}

                        {(summary.slippageCostUsd ?? 0) > 0 && (
                            <tr className="group hover:bg-white/50 transition-colors relative">
                                <td className="px-6 py-4 font-bold text-slate-800">Slippage Cost</td>
                                <td className="px-6 py-4 text-orange-500 font-mono font-black text-lg">-${summary.slippageCostUsd!.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4">—</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "3%" }}
                                                transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                                                className="h-full bg-orange-400"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">3%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-500 text-[10px] font-black uppercase tracking-wider shadow-sm border border-slate-200">
                                        Deducted
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
