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

export default function StrategyModal({ strategy, fetchedTokens, onClose, onApplyParams, onRunSimulation }: Props) {
    return (
        <AnimatePresence>
            {strategy && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-black text-white">{strategy.title}</h2>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${strategy.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                        strategy.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                        {strategy.riskLevel} risk
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400">{strategy.description}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">
                            <div className="space-y-4">
                                <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4">Allocation Details</h3>
                                {strategy.allocations.map((alloc, idx) => (
                                    <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative overflow-hidden group">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center font-black text-white text-lg border border-white/10 shadow-inner">
                                                    {alloc.assetSymbol[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                        {alloc.assetSymbol}
                                                        {alloc.network && (
                                                            <span className="text-[10px] font-medium bg-white/10 px-1.5 py-0.5 rounded text-slate-300 capitalize">{alloc.network}</span>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{alloc.protocol} • <span className="text-slate-500">{alloc.poolType}</span></p>
                                                </div>
                                            </div>
                                            <div className="sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                                                <div className="text-2xl font-black text-accent-neon font-mono">{alloc.percentage}%</div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Portfolio Allocation</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mt-4 pt-4 border-t border-white/5">
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">monitoring</span>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">APY Range</p>
                                                </div>
                                                <p className="font-mono text-sm font-medium text-white">{alloc.apyMin}% - {alloc.apyMax}%</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">moving</span>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Current APY</p>
                                                </div>
                                                <p className="font-mono text-sm font-medium text-white">{alloc.currentApy ? `${alloc.currentApy.toFixed(2)}%` : '-'}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">account_balance</span>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">TVL (USD)</p>
                                                </div>
                                                <p className="font-mono text-sm font-medium text-white">
                                                    {alloc.tvlUsd ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(alloc.tvlUsd) : '-'}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">update</span>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Last Updated</p>
                                                </div>
                                                <p className="text-xs text-slate-300">
                                                    {alloc.dataTimestamp ? format(new Date(alloc.dataTimestamp), "MMM dd, yyyy HH:mm") : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-white/5 bg-black/40 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors w-full sm:w-auto text-center"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => onApplyParams(strategy)}
                                className="px-6 py-3 rounded-xl font-bold bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10 w-full sm:w-auto flex justify-center items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                Apply Parameters
                            </button>
                            <button
                                onClick={() => onRunSimulation(strategy)}
                                className="px-6 py-3 rounded-xl font-bold bg-accent-neon text-black hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                Run Simulation
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
