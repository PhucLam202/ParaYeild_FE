import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { TokenEntry } from "@/hooks/useSimulation";
import type { SuggestedStrategy } from "@/types/simulator";

interface Props {
    strategy: SuggestedStrategy | null;
    fetchedTokens: TokenEntry[];
    onClose: () => void;
    onApplyParams: (strategy: SuggestedStrategy) => void;
    onRunSimulation: (strategy: SuggestedStrategy) => void;
}

export default function StrategyModal({ strategy, onClose, onApplyParams, onRunSimulation }: Props) {
    if (!strategy) return null;

    return (
        <AnimatePresence>
            {strategy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-500/20 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-clay-lg border border-white flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 shrink-0 border-b border-slate-100">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-clay-sm">
                                        <span className="material-symbols-outlined text-primary text-3xl">insights</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{strategy.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${strategy.riskLevel === 'low' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                                    strategy.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                                        'bg-red-500/10 text-red-600 border-red-500/20'
                                                }`}>
                                                {strategy.riskLevel} risk
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <p className="text-slate-600 leading-relaxed text-lg">
                                {strategy.description}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-6 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="clay-card bg-slate-50 p-4 rounded-2xl shadow-clay-sm border border-white">
                                    <p className="text-slate-500 text-sm mb-1 uppercase font-bold tracking-wider">Complexity</p>
                                    <p className="text-3xl font-bold text-slate-900">Medium</p>
                                </div>
                                <div className="clay-card bg-slate-50 p-4 rounded-2xl shadow-clay-sm border border-white font-mono">
                                    <p className="text-slate-500 text-sm mb-1 uppercase font-bold tracking-wider">Historical Perf</p>
                                    <p className="text-3xl font-bold text-primary">+14.2%</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    Allocations
                                </h3>
                                <div className="space-y-3">
                                    {strategy.allocations.map((alloc, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50 border border-white shadow-clay-sm"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-white flex items-center justify-center font-black text-slate-700 text-sm border border-slate-100 shadow-clay-sm">
                                                        {alloc.assetSymbol[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{alloc.assetSymbol}</h4>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold">{alloc.protocol}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-primary">{alloc.percentage}%</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/50">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">APY Range</p>
                                                    <p className="text-sm font-bold text-slate-700">{alloc.apyMin}% - {alloc.apyMax}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">TVL</p>
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {alloc.tvlUsd ? `$${(alloc.tvlUsd / 1000000).toFixed(1)}M` : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 pt-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => onApplyParams(strategy)}
                                className="clay-card flex-1 bg-white text-slate-700 font-bold py-4 rounded-2xl shadow-clay-sm border border-white hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">tune</span>
                                Apply Params
                            </button>
                            <button
                                onClick={() => onRunSimulation(strategy)}
                                className="clay-button-primary flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-clay-primary active:shadow-clay-inner transition-all hover:brightness-105 uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">play_arrow</span>
                                Run Simulation
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
