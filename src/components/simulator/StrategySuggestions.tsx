import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { SuggestedStrategy, SuggestStrategiesResponse } from "@/types/simulator";

interface Props {
    suggestedStrategies: SuggestStrategiesResponse | null;
    isSuggesting: boolean;
    isSimulating: boolean;
    simulationSteps: string[];
    currentStepIndex: number;
    isSimulatingActive: boolean;
    handleRunSimulation: (customAllocations?: any[]) => Promise<void>;
    handleSuggestStrategies: (refresh?: boolean) => Promise<void>;
    handleSelectStrategy: (strategy: SuggestedStrategy, shouldRun?: boolean) => void;
}

export default function StrategySuggestions({
    suggestedStrategies,
    isSuggesting,
    isSimulating,
    simulationSteps,
    currentStepIndex,
    isSimulatingActive,
    handleRunSimulation,
    handleSuggestStrategies,
    handleSelectStrategy,
}: Props) {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-neon">auto_awesome</span>
                    <h2 className="text-xl font-bold text-white">AI-Powered Suggestions</h2>
                </div>
                <button
                    onClick={() => handleSuggestStrategies(true)}
                    disabled={isSuggesting}
                    className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isSuggesting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-neon/20 hover:text-accent-neon'}`}
                >
                    {isSuggesting ? (
                        <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <span className="material-symbols-outlined text-sm">refresh</span>
                    )}
                    Refresh Suggestions
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isSuggesting && !suggestedStrategies ? (
                    <motion.div
                        key="suggestions-skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {[1, 2].map((i) => (
                            <div key={i} className="glass-card rounded-xl p-6 h-48 bg-white/5 border-white/10 space-y-4">
                                <div className="flex justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-32 bg-white/10" />
                                        <Skeleton className="h-4 w-24 bg-white/5" />
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Skeleton className="h-6 w-16 bg-white/10 ml-auto" />
                                        <Skeleton className="h-3 w-12 bg-white/5 ml-auto" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full bg-white/5" />
                                <Skeleton className="h-4 w-3/4 bg-white/5" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-full bg-white/5 rounded-lg" />
                                    <Skeleton className="h-8 w-8 bg-white/5 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : suggestedStrategies && suggestedStrategies.chains ? (
                    <motion.div
                        key="suggestions-content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`grid grid-cols-1 md:grid-cols-2 gap-4 relative transition-all duration-300 ${isSuggesting ? 'opacity-40 blur-[2px] pointer-events-none' : ''}`}
                    >
                        {isSuggesting && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/5 rounded-2xl">
                                <div className="w-10 h-10 border-4 border-accent-neon/20 border-t-accent-neon rounded-full animate-spin mb-4"></div>
                                <p className="text-accent-neon font-bold animate-pulse tracking-widest uppercase text-xs">Analyzing Markets...</p>
                            </div>
                        )}
                        {suggestedStrategies.chains.map((strategy) => (
                            <div
                                key={strategy.id}
                                onClick={() => handleSelectStrategy(strategy, false)}
                                className="glass-card group relative p-6 rounded-xl hover:border-accent-neon/50 cursor-pointer transition-all hover:bg-white/[0.02]"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-black text-white group-hover:text-accent-neon transition-colors line-clamp-1">{strategy.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${strategy.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                                strategy.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-red-500/10 text-red-500'
                                                }`}>
                                                {strategy.riskLevel} risk
                                            </span>
                                            <span className="text-[10px] text-slate-500 uppercase font-black">{strategy.allocations.length} Protocols</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-accent-neon font-mono">{strategy.estimatedApyMin}-{strategy.estimatedApyMax}%</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Est. APY</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
                                    {strategy.description}
                                </p>
                                <div className="flex items-center gap-1 overflow-hidden">
                                    {strategy.allocations.map((alloc, idx) => (
                                        <div key={idx} className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 bg-white/5 py-1.5 px-2 rounded border border-white/5 group-hover:border-white/10">
                                                <div className="size-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-black text-white">
                                                    {alloc.assetSymbol[0]}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[9px] font-bold text-slate-300 truncate">{alloc.assetSymbol}</span>
                                                    <span className="text-[8px] text-slate-500 uppercase truncate">{alloc.percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectStrategy(strategy, true);
                                        }}
                                        className="size-8 rounded-lg bg-accent-neon text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform active:scale-95 z-20"
                                    >
                                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => handleRunSimulation()}
                    disabled={isSimulating}
                    className={`relative flex-1 py-5 rounded-xl font-black text-base uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-h-[68px] overflow-hidden group ${isSimulating
                        ? 'bg-white/5 border border-white/10 text-white cursor-not-allowed'
                        : 'bg-accent-neon text-black hover:shadow-[0_0_60px_rgba(0,255,163,0.5)] hover:scale-[1.02] active:scale-[0.98] font-mono'
                        }`}
                >
                    {!isSimulating && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                    )}
                    {isSimulating ? (
                        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8 py-2 gap-3 h-full">
                            <div className="flex flex-col sm:flex-row items-center justify-between w-full h-full gap-3 sm:gap-6">
                                <div className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-1/2">
                                    <div className="w-5 h-5 border-2 border-accent-neon/20 border-t-accent-neon rounded-full animate-spin shrink-0"></div>
                                    <motion.span
                                        key={currentStepIndex}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-sm font-bold text-slate-300 w-full text-center sm:text-left truncate block min-w-0"
                                    >
                                        {simulationSteps[currentStepIndex] || "Processing..."}
                                    </motion.span>
                                </div>
                                <div className="w-full sm:w-1/2 max-w-sm h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 mt-1 sm:mt-0">
                                    <motion.div
                                        className="h-full bg-accent-neon"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(5, ((currentStepIndex) / (simulationSteps.length || 1)) * 100)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">play_arrow</span>
                            Run Simulation
                        </>
                    )}
                </button>
                {!suggestedStrategies && (
                    <button
                        onClick={() => handleSuggestStrategies(false)}
                        disabled={isSuggesting || isSimulating}
                        className={`px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2 justify-center ${isSuggesting || isSimulating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                    >
                        {isSuggesting ? (
                            <div className="flex items-center gap-2 text-slate-300">
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin text-slate-300"></span>
                            </div>
                        ) : (
                            <>Get AI Recommendations <span className="material-symbols-outlined text-sm">auto_awesome</span></>
                        )}
                    </button>
                )}
            </div>
        </section>
    );
}
