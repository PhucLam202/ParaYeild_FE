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
                        {breakdown.map((item, idx) => {
                            const displayApy = item.avgTotalApyPercent ?? item.avgApyPercent ?? 0;
                            return (
                                <React.Fragment key={idx}>
                                    <tr className="group hover:bg-white/[0.02] transition-colors relative">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex flex-col">
                                                <span className="group-hover:text-accent-neon transition-colors flex items-center flex-wrap gap-1">
                                                    Total Yield ({item.assetSymbol})
                                                    {item.isFallbackData && (
                                                        <span title={item.warning} className="ml-1 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 cursor-help">
                                                            Estimated
                                                        </span>
                                                    )}
                                                    {item.hasHistoricalData === false && (
                                                        <span className="text-xs text-red-400/80 ml-1">No historical data — APY: 0%</span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-slate-500 font-normal">
                                                    Protocol: {item.protocol.toUpperCase()}
                                                    {displayApy > 0 && (
                                                        <span className="ml-2 text-accent-neon/70">~{displayApy.toFixed(2)}% APY</span>
                                                    )}
                                                </span>
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
                                                        d={generateSparklinePath(timeSeries, 'totalValueUsd')}
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
                                                    />
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
                                    {item.yieldFarmingStats && (
                                        <tr className="bg-white/[0.01]">
                                            <td colSpan={5} className="px-6 pb-4 pt-0">
                                                <div className="glass-card rounded-lg p-3 border border-white/5 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Farm Rewards</span>
                                                        <span className="text-accent-neon font-mono font-bold">+${item.yieldFarmingStats.totalFarmingRewardsEarnedUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Compounded</span>
                                                        <span className="text-white font-mono font-bold">+${item.yieldFarmingStats.totalCompoundedRewardsUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Unclaimed</span>
                                                        <span className="text-slate-300 font-mono font-bold">${item.yieldFarmingStats.remainingUnclaimedRewardsUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Harvest Fees</span>
                                                        <span className="text-red-400 font-mono font-bold">-${item.yieldFarmingStats.harvestFeesPaidUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-500 uppercase tracking-widest font-bold">Harvest Events</span>
                                                        <span className="text-slate-300 font-mono font-bold">{item.yieldFarmingStats.harvestEventsCount}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0) !== 0 && (
                            <tr className="group hover:bg-white/[0.02] transition-colors relative">
                                <td className="px-6 py-4 font-medium text-white">
                                    <span className="group-hover:text-red-400 transition-colors">Impermanent Loss</span>
                                </td>
                                <td className="px-6 py-4 text-red-400 font-mono font-bold">
                                    -${Math.abs(breakdown.reduce((acc, curr) => acc + curr.ilLossUsd, 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
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
                                            />
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

                        {summary.xcmFeesPaidUsd > 0 && (
                            <tr className="group hover:bg-white/[0.02] transition-colors relative">
                                <td className="px-6 py-4 font-medium text-white">XCM Gas Overhead</td>
                                <td className="px-6 py-4 text-slate-400 font-mono font-bold">-${summary.xcmFeesPaidUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4">—</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "5%" }}
                                                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                                                className="h-full bg-slate-400"
                                            />
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

                        {(summary.slippageCostUsd ?? 0) > 0 && (
                            <tr className="group hover:bg-white/[0.02] transition-colors relative">
                                <td className="px-6 py-4 font-medium text-white">Slippage Cost</td>
                                <td className="px-6 py-4 text-orange-400 font-mono font-bold">-${summary.slippageCostUsd!.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4">—</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "3%" }}
                                                transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                                                className="h-full bg-orange-400"
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500">3%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-400/10 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-400/20">
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
