"use client";

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
        <div className="space-y-5 rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Price Range
                    </label>
                    <p className="text-lg font-black text-slate-800">Min and max price only</p>
                    <p className="mt-1 text-sm text-slate-500 font-medium">
                        The volatility bar was removed to keep the concentration setting focused on the exact bounds you want to simulate.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAutoFill}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary/30"
                >
                    <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                    Auto-Fill History
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Min Price</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <span className="text-xs font-black text-primary/40">$</span>
                        </div>
                        <input
                            className="w-full bg-white border border-slate-100 py-3.5 pl-10 pr-6 rounded-2xl font-black text-slate-800 outline-none focus:ring-4 ring-primary/5 text-lg transition-all shadow-sm group-hover:border-primary/20"
                            type="number"
                            step="0.01"
                            value={priceRange.min}
                            onChange={(e) => updateMinPrice(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center pt-6">
                    <div className="size-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-base">east</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Max Price</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <span className="text-xs font-black text-primary/40">$</span>
                        </div>
                        <input
                            className="w-full bg-white border border-slate-100 py-3.5 pl-10 pr-6 rounded-2xl font-black text-slate-800 outline-none focus:ring-4 ring-primary/5 text-lg transition-all shadow-sm group-hover:border-primary/20"
                            type="number"
                            step="0.01"
                            value={priceRange.max}
                            onChange={(e) => updateMaxPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500 font-medium">
                    <p>Position active between ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}</p>
                    <p className="mt-1 text-xs text-slate-400">({rangePercent}% price band around spot ${currentPrice.toFixed(2)})</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">Width ${rangeWidth.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
