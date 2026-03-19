"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    priceRange: { min: number; max: number };
    setPriceRange: (v: { min: number; max: number }) => void;
    currentPrice?: number;
    onAutoFill: () => void;
}

function clampPrice(value: number) {
    return Math.max(0.01, Math.round(value * 100) / 100);
}

export default function PriceRangeVisual({
    priceRange,
    setPriceRange,
    currentPrice = 1.0,
    onAutoFill,
}: Props) {
    const rangeWidth = clampPrice(priceRange.max - priceRange.min);
    const rangePercent = Math.round((rangeWidth / currentPrice) * 100);

    const updateMinPrice = (value: number) => {
        const nextMin = clampPrice(value);
        setPriceRange({
            min: Math.min(nextMin, priceRange.max - 0.01),
            max: priceRange.max,
        });
    };

    const updateMaxPrice = (value: number) => {
        const nextMax = clampPrice(value);
        setPriceRange({
            min: priceRange.min,
            max: Math.max(nextMax, priceRange.min + 0.01),
        });
    };

    return (
        <motion.div 
            layout
            className="space-y-5 rounded-3xl border border-slate-200/60 bg-white/50 p-5 shadow-sm backdrop-blur-xl"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <label className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span className="material-symbols-outlined text-sm">timeline</span>
                        Price Range
                    </label>
                    <p className="text-lg font-black text-slate-800">Min and max price</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Set the exact bounds you want to simulate for your liquidity position.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onAutoFill}
                    className="inline-flex items-center justify-center shrink-0 gap-1.5 w-full sm:w-auto rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 hover:border-primary/30"
                >
                    <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                    Auto-Fill
                </motion.button>
            </div>

            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-1.5">
                    <label className="ml-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Min Price</label>
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                            <span className="text-sm font-black text-slate-400 group-focus-within:text-primary transition-colors">$</span>
                        </div>
                        <input
                            className="w-full rounded-2xl border border-slate-200/60 bg-white py-3.5 pl-9 pr-6 text-lg font-black text-slate-800 shadow-sm outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4 group-hover:border-slate-300"
                            type="number"
                            step="0.01"
                            value={priceRange.min}
                            onChange={(e) => updateMinPrice(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center pt-6">
                    <div className="flex size-10 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-400 shadow-sm transition-transform hover:scale-110">
                        <span className="material-symbols-outlined text-base">east</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="ml-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Max Price</label>
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                            <span className="text-sm font-black text-slate-400 group-focus-within:text-primary transition-colors">$</span>
                        </div>
                        <input
                            className="w-full rounded-2xl border border-slate-200/60 bg-white py-3.5 pl-9 pr-6 text-lg font-black text-slate-800 shadow-sm outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4 group-hover:border-slate-300"
                            type="number"
                            step="0.01"
                            value={priceRange.max}
                            onChange={(e) => updateMaxPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <motion.div 
                layout
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="text-sm font-medium text-slate-500">
                    <p className="flex items-center gap-1.5">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                        </span>
                        Active between ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        ({rangePercent}% price band around spot ${currentPrice.toFixed(2)})
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                        Width ${rangeWidth.toFixed(2)}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}
