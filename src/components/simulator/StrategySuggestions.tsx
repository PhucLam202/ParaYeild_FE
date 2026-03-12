import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { SuggestedStrategy, SuggestStrategiesResponse, SimulationAllocation } from "@/types/simulator";

interface Props {
    suggestedStrategies: SuggestStrategiesResponse | null;
    isSuggesting: boolean;
    isSimulating: boolean;
    simulationSteps: string[];
    currentStepIndex: number;
    handleRunSimulation: (customAllocations?: SimulationAllocation[]) => Promise<void>;
    handleSuggestStrategies: (refresh?: boolean) => Promise<void>;
    handleSelectStrategy: (strategy: SuggestedStrategy, shouldRun?: boolean) => void;
}

export default function StrategySuggestions({
    suggestedStrategies,
    isSuggesting,
    isSimulating,
    simulationSteps,
    currentStepIndex,
    handleRunSimulation,
    handleSuggestStrategies,
    handleSelectStrategy,
}: Props) {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 md:p-3 clay-inset rounded-xl md:rounded-2xl">
                        <span className="material-symbols-outlined text-primary font-bold">auto_awesome</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-800">AI Suggestions</h2>
                </div>
                <button
                    onClick={() => handleSuggestStrategies(true)}
                    disabled={isSuggesting}
                    className={`clay-button-tactile px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${isSuggesting ? 'opacity-50 cursor-not-allowed' : 'text-slate-500 hover:text-primary'}`}
                >
                    {isSuggesting ? (
                        <span className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    ) : (
                        <span className="material-symbols-outlined text-sm md:text-base">refresh</span>
                    )}
                    <span className="hidden sm:inline">Refresh Suggestions</span>
                    <span className="sm:hidden">Refresh</span>
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
                        {[1, 2, 3, 4].slice(0, 2).map((i) => (
                            <div key={i} className="clay-card rounded-2xl p-6 h-48 space-y-4">
                                <div className="flex justify-between">
                                    <div className="space-y-2 w-1/2">
                                        <Skeleton className="h-6 w-full bg-slate-200" />
                                        <Skeleton className="h-4 w-3/4 bg-slate-100" />
                                    </div>
                                    <div className="text-right space-y-2 w-1/3">
                                        <Skeleton className="h-6 w-full bg-slate-200 ml-auto" />
                                        <Skeleton className="h-3 w-3/4 bg-slate-100 ml-auto" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full bg-slate-100" />
                                <Skeleton className="h-4 w-3/4 bg-slate-100" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-10 w-full bg-slate-100 rounded-xl" />
                                    <Skeleton className="h-10 w-12 bg-slate-200 rounded-xl" />
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
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                                <p className="text-primary font-bold animate-pulse tracking-widest uppercase text-xs">Analyzing Markets...</p>
                            </div>
                        )}
                        {suggestedStrategies.chains.map((strategy) => (
                            <div
                                key={strategy.id}
                                onClick={() => handleSelectStrategy(strategy, false)}
                                className="clay-card group relative p-6 rounded-2xl cursor-pointer transition-transform hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="pr-4">
                                        <h3 className="text-lg font-black text-slate-800 group-hover:text-primary transition-colors line-clamp-1">{strategy.title}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${strategy.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                                                strategy.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {strategy.riskLevel} risk
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase font-black">{strategy.allocations.length} Protocols</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xl font-black text-primary font-display">{strategy.estimatedApyMin}-{strategy.estimatedApyMax}%</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Est. APY</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 font-semibold leading-relaxed line-clamp-2 mb-6">
                                    {strategy.description}
                                </p>
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {strategy.allocations.map((alloc, idx) => (
                                        <div key={idx} className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 clay-inset py-1.5 px-2.5 rounded-xl border border-transparent group-hover:border-primary/10 transition-colors">
                                                <div className="size-5 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-black text-slate-600">
                                                    {alloc.assetSymbol[0]}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-700 truncate">{alloc.assetSymbol}</span>
                                                    <span className="text-[9px] font-bold text-primary uppercase truncate">{alloc.percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectStrategy(strategy, true);
                                        }}
                                        className="size-10 shrink-0 rounded-xl clay-button-primary flex items-center justify-center transform group-hover:scale-105 active:scale-95 transition-all z-20 text-white"
                                    >
                                        <span className="material-symbols-outlined text-xl">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                    onClick={() => handleRunSimulation()}
                    disabled={isSimulating}
                    className={`relative flex-1 py-4 sm:py-5 rounded-clay-lg font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 overflow-hidden ${isSimulating
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-inner'
                        : 'clay-button-primary active:scale-[0.98]'
                        }`}
                >
                    {isSimulating ? (
                        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8 py-1 gap-2 h-full">
                            <div className="flex flex-col sm:flex-row items-center justify-between w-full h-full gap-2 sm:gap-6">
                                <div className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-1/2">
                                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-500 rounded-full animate-spin shrink-0"></div>
                                    <motion.span
                                        key={currentStepIndex}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-sm font-bold w-full text-center sm:text-left truncate block min-w-0"
                                    >
                                        {simulationSteps[currentStepIndex] || "Processing..."}
                                    </motion.span>
                                </div>
                                <div className="w-full sm:w-1/2 max-w-sm h-2 bg-slate-300/50 rounded-full overflow-hidden shrink-0 mt-1 sm:mt-0">
                                    <motion.div
                                        className="h-full bg-slate-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(5, ((currentStepIndex) / (simulationSteps.length || 1)) * 100)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-2xl">bolt</span>
                            Run Simulation
                        </>
                    )}
                </button>
                {!suggestedStrategies && (
                    <button
                        onClick={() => handleSuggestStrategies(false)}
                        disabled={isSuggesting || isSimulating}
                        className={`py-4 sm:py-5 px-8 rounded-clay-lg font-bold transition-all flex items-center gap-3 justify-center text-lg ${isSuggesting || isSimulating ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-inner' : 'clay-button-tactile text-slate-600 hover:text-primary'}`}
                    >
                        {isSuggesting ? (
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-500 rounded-full animate-spin"></span>
                                <span>Analyzing...</span>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                Get AI Recommendations
                            </>
                        )}
                    </button>
                )}
            </div>
        </section>
    );
}
