"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import CustomSelect from "@/components/ui/CustomSelect";
import { usePoolsExplorer, type TvlRange, type ApyRange } from "@/hooks/usePoolsExplorer";
import { getEffectiveApy } from "@/services/simulatorService";
import { formatLabel } from "@/hooks/useSimulation";
import type { LpFarmPool } from "@/types/simulator";

function formatTvl(value: number | null): string {
    if (value == null) return "-";
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
}

function formatApy(value: number | null | undefined): string {
    if (value == null) return "-";
    return `${value.toFixed(1)}%`;
}

function getRiskColor(score: number | null | undefined): string {
    if (score == null) return "bg-slate-100 text-slate-500";
    if (score <= 3) return "bg-emerald-100 text-emerald-700";
    if (score <= 6) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
}

function TrendIcon({ trend }: { trend?: string }) {
    if (trend === 'up') return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

function buildSimulateUrl(pool: LpFarmPool): string {
    const params = new URLSearchParams();
    params.set("protocol", pool.protocol);
    params.set("asset", pool.assetSymbol);
    params.set("poolType", pool.poolType);
    params.set("network", pool.network);
    return `/simulator?${params.toString()}`;
}

export default function PoolsExplorerSection() {
    const {
        visiblePools,
        filteredPools,
        isLoading,
        error,
        chain, setChain,
        category, setCategory,
        tvlRange, setTvlRange,
        apyRange, setApyRange,
        isExpanded, setIsExpanded,
        availableChains,
        availableCategories,
        clearFilters,
        hasActiveFilters,
        remainingCount,
        currentPage, setCurrentPage,
        totalPages,
        usePagination,
    } = usePoolsExplorer();
    
    const [isChangingPage, setIsChangingPage] = useState(false);

    const handlePageChange = (page: number) => {
        if (page === currentPage) return;
        setIsChangingPage(true);
        setCurrentPage(page);
        // Short delay to allow the state to update and show skeletons briefly for smooth transition
        setTimeout(() => {
            setIsChangingPage(false);
        }, 300);
    };

    const isLoadingState = isLoading || isChangingPage;

    return (
        <section className="py-24 md:py-32 w-full relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
                >
                    Explore <span className="text-gradient">High-Yield Pools</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600 text-lg"
                >
                    Discover and simulate the best yield opportunities across the Polkadot ecosystem.
                </motion.p>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-4 mb-8 relative z-50 p-3 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-clay-sm"
            >
                <div className="w-[160px]">
                    <CustomSelect
                        value={chain}
                        onChange={setChain}
                        options={[
                            { label: "Parachain", value: "all" },
                            ...availableChains.map(c => ({ label: formatLabel(c), value: c }))
                        ]}
                        placeholder="Parachain"
                    />
                </div>

                <div className="w-[160px]">
                    <CustomSelect
                        value={category}
                        onChange={setCategory}
                        options={[
                            { label: "Category", value: "all" },
                            ...availableCategories.map(c => ({ label: formatLabel(c), value: c }))
                        ]}
                        placeholder="Category"
                    />
                </div>

                <div className="w-[180px]">
                    <CustomSelect
                        value={tvlRange}
                        onChange={(val: string) => setTvlRange(val as TvlRange)}
                        options={[
                            { label: "Select Position", value: "all" },
                            { label: "< $1M", value: "0-1M" },
                            { label: "$1M – $10M", value: "1M-10M" },
                            { label: "$10M – $100M", value: "10M-100M" },
                            { label: "$100M+", value: "100M+" }
                        ]}
                        placeholder="Select Position"
                    />
                </div>

                <div className="w-[180px]">
                    <CustomSelect
                        value={apyRange}
                        onChange={(val: string) => setApyRange(val as ApyRange)}
                        options={[
                            { label: "Option", value: "all" },
                            { label: "0% – 5%", value: "0-5" },
                            { label: "5% – 15%", value: "5-15" },
                            { label: "15% – 30%", value: "15-30" },
                            { label: "30%+", value: "30+" }
                        ]}
                        placeholder="Option"
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition-all clay-button shadow-sm"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </button>
                )}

                <span className="ml-auto text-xs font-bold text-slate-400">
                    {filteredPools.length} pool{filteredPools.length !== 1 ? "s" : ""}
                </span>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="clay-card rounded-clay-lg p-6 lg:p-10 overflow-hidden shadow-clay-md min-h-[500px] flex flex-col"
            >
                <AnimatePresence mode="wait">
                    {isLoadingState ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 flex-1"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left text-slate-500 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-display font-black">Protocol & Chain</th>
                                            <th className="px-6 py-4 font-display font-black">Pool Name</th>
                                            <th className="px-6 py-4 font-display font-black text-right">TVL</th>
                                            <th className="px-6 py-4 font-display font-black text-right">APY</th>
                                            <th className="px-6 py-4 font-display font-black text-right">30D Avg APY</th>
                                            <th className="px-6 py-4 font-display font-black text-center">Risk</th>
                                            <th className="px-6 py-4 font-display font-black text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {[1, 2, 3, 4, 5].map((idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-6"><Skeleton className="h-10 w-32 rounded-xl" /></td>
                                                <td className="px-6 py-6"><Skeleton className="h-10 w-24 rounded-xl" /></td>
                                                <td className="px-6 py-6"><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></td>
                                                <td className="px-6 py-6"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
                                                <td className="px-6 py-6"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
                                                <td className="px-6 py-6"><div className="flex justify-center"><Skeleton className="h-6 w-12 rounded-full" /></div></td>
                                                <td className="px-6 py-6"><div className="flex justify-center"><Skeleton className="h-9 w-24 rounded-xl" /></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 text-slate-500"
                        >
                            {error}
                        </motion.div>
                    ) : filteredPools.length === 0 ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 text-slate-500 font-medium"
                        >
                            No pools match your filters.{" "}
                            <button onClick={clearFilters} className="text-primary hover:underline font-bold">Clear filters</button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="overflow-x-auto"
                        >
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-slate-500 text-xs uppercase tracking-widest font-display">
                                        <th className="px-6 py-4 font-black">Protocol & Chain</th>
                                        <th className="px-6 py-4 font-black">Pool Name</th>
                                        <th className="px-6 py-4 font-black text-right">TVL</th>
                                        <th className="px-6 py-4 font-black text-right">APY</th>
                                        <th className="px-6 py-4 font-black text-right">30D Avg APY</th>
                                        <th className="px-6 py-4 font-black text-center">Risk</th>
                                        <th className="px-6 py-4 font-black text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/50">
                                    <AnimatePresence initial={false}>
                                        {visiblePools.map((pool, i) => (
                                            <motion.tr
                                                key={`${pool.protocol}-${pool.network}-${pool.assetSymbol}-${pool.poolType}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, delay: i * 0.01 }}
                                                className="group hover:bg-slate-50/60 transition-all duration-300 rounded-2xl"
                                            >
                                            <td className="px-6 py-6">
                                                <div className="font-bold font-display text-slate-900">{formatLabel(pool.protocol)}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{formatLabel(pool.network)}</div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="font-bold font-display text-slate-800 text-base">{pool.assetSymbol}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{formatLabel(pool.poolType)}</div>
                                            </td>
                                            <td className="px-6 py-6 text-right font-bold text-slate-700">
                                                {formatTvl(pool.tvlUsd)}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="font-bold text-slate-900 text-base">{formatApy(getEffectiveApy(pool))}</div>
                                                {pool.rewardApy != null && pool.rewardApy > 0 && (
                                                    <div className="text-[10px] font-black text-emerald-600 mt-1 uppercase tracking-wider">+{formatApy(pool.rewardApy)} reward</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex items-center justify-end gap-1 font-bold">
                                                    <span className="text-slate-700">{formatApy(pool.apy30dAvg)}</span>
                                                    <TrendIcon trend={pool.apyTrend} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getRiskColor(pool.riskScore)}`}>
                                                    {pool.riskScore != null ? `${pool.riskScore}/10` : "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <Link
                                                    href={buildSimulateUrl(pool)}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 clay-button-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-clay-sm group-hover:shadow-clay-primary bg-primary hover:brightness-105"
                                                >
                                                    Simulate
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Pagination (when > 10 pools) */}
            {!isLoading && !error && usePagination && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1 || isChangingPage}
                        className="p-2 rounded-xl clay-button-tactile border border-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={isChangingPage}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                                page === currentPage
                                    ? "clay-button-primary shadow-clay-primary text-white"
                                    : "clay-button-tactile text-slate-600 border border-slate-100"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || isChangingPage}
                        className="p-2 rounded-xl clay-button-tactile border border-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Expand / Collapse (when <= 10 pools but more than 5) */}
            {!isLoading && !error && !usePagination && remainingCount > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-6"
                >
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all"
                    >
                        {isExpanded ? (
                            <>
                                Show Less
                                <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                View {remainingCount} More Pool{remainingCount !== 1 ? "s" : ""}
                                <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </motion.div>
            )}
        </section>
    );
}
