"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
    priceRange: { min: number; max: number };
    setPriceRange: (v: { min: number; max: number }) => void;
    currentPrice?: number;
    historicalPrices?: number[];
    onAutoFill: () => void;
}

const RANGE_MIN = 0.5;
const RANGE_MAX = 1.5;

function priceToFraction(price: number): number {
    return Math.max(0, Math.min(1, (price - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)));
}

function fractionToPrice(f: number): number {
    return RANGE_MIN + f * (RANGE_MAX - RANGE_MIN);
}

// CSS calc helper: positions within the bar accounting for handle padding
// Result: calc(PAD + fraction * (100% - 2*PAD))
function pos(fraction: number, pad: number = 24): string {
    return `calc(${pad}px + ${fraction} * (100% - ${pad * 2}px))`;
}

function widthCalc(f1: number, f2: number, pad: number = 24): string {
    return `calc(${f2 - f1} * (100% - ${pad * 2}px))`;
}

export default function PriceRangeVisual({
    priceRange,
    setPriceRange,
    currentPrice = 1.0,
    historicalPrices,
    onAutoFill,
}: Props) {
    const barRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<"min" | "max" | null>(null);

    const PAD = 24;

    const getFractionFromEvent = useCallback((clientX: number) => {
        if (!barRef.current) return 0;
        const rect = barRef.current.getBoundingClientRect();
        const innerWidth = rect.width - PAD * 2;
        const x = clientX - rect.left - PAD;
        return Math.max(0, Math.min(1, x / innerWidth));
    }, []);

    const handlePointerDown = useCallback((handle: "min" | "max") => (e: React.PointerEvent) => {
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setDragging(handle);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragging) return;
        const frac = getFractionFromEvent(e.clientX);
        const price = Math.round(fractionToPrice(frac) * 100) / 100;

        if (dragging === "min") {
            setPriceRange({ ...priceRange, min: Math.min(price, priceRange.max - 0.01) });
        } else {
            setPriceRange({ ...priceRange, max: Math.max(price, priceRange.min + 0.01) });
        }
    }, [dragging, priceRange, setPriceRange, getFractionFromEvent]);

    const handlePointerUp = useCallback(() => {
        setDragging(null);
    }, []);

    const minF = priceToFraction(priceRange.min);
    const maxF = priceToFraction(priceRange.max);
    const currentF = priceToFraction(currentPrice);
    const rec30dMinF = priceToFraction(0.95);
    const rec30dMaxF = priceToFraction(1.05);

    // Mini sparkline
    const sparklinePath = historicalPrices && historicalPrices.length > 1
        ? (() => {
            const lo = Math.min(...historicalPrices);
            const hi = Math.max(...historicalPrices);
            const range = hi - lo || 1;
            const step = 100 / (historicalPrices.length - 1);
            return historicalPrices
                .map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${70 - ((p - lo) / range) * 60}`)
                .join(" ");
        })()
        : null;

    const sparklineAreaPath = sparklinePath ? `${sparklinePath} L100,70 L0,70 Z` : null;

    return (
        <div className="md:col-span-2 lg:col-span-3 space-y-5 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Price Strategy
                        </label>
                        <span className="text-xs font-bold text-slate-800">Custom Concentration Range</span>
                    </div>
                    {/* Info icon with tooltip */}
                    <div className="relative group/info">
                        <div className="size-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-help hover:bg-primary/10 hover:border-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover/info:text-primary">info</span>
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-slate-800 text-white text-[11px] font-medium rounded-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl w-[280px] leading-relaxed">
                            Set the price range for concentrated liquidity. Your position only earns fees when the token price stays within this range. Narrower range = higher APY but more risk of going out-of-range.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-800" />
                        </div>
                    </div>
                </div>
                <button
                    onClick={onAutoFill}
                    className="text-[10px] font-black text-primary hover:text-primary-dark transition-all flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:shadow-sm active:scale-95"
                >
                    <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                    AUTO-FILL HISTORY
                </button>
            </div>

            {/* Price Bar */}
            <div className="relative pt-6 pb-8">
                {/* 30d label above the bar */}
                <div
                    className="absolute top-0 flex items-center gap-1 z-10"
                    style={{ left: pos((rec30dMinF + rec30dMaxF) / 2), transform: 'translateX(-50%)' }}
                >
                    <span className="text-[9px] font-black text-amber-500/80 uppercase tracking-wider whitespace-nowrap">
                        30D Volatility Range
                    </span>
                </div>

                <div
                    ref={barRef}
                    className="relative h-20 clay-inset rounded-[1.5rem] select-none border border-slate-100/50"
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{ touchAction: "none" }}
                >
                    {/* Background layers */}
                    <div className="absolute inset-0 bg-neutral-50/50 rounded-[1.5rem]" />
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[1.5rem]"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50/40 via-transparent to-emerald-50/40 rounded-[1.5rem]" />

                    {/* Sparkline background */}
                    {sparklinePath && (
                        <div className="absolute inset-0 opacity-20 pointer-events-none p-2">
                            <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="w-full h-full">
                                <defs>
                                    <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgb(74 222 128)" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="rgb(74 222 128)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={sparklineAreaPath!} fill="url(#sparkFill)" />
                                <path d={sparklinePath} fill="none" stroke="rgb(34 197 94)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </div>
                    )}

                    {/* 30d range highlight band */}
                    <div
                        className="absolute top-0 bottom-0 bg-amber-200/20 border-x border-amber-300/30"
                        style={{ left: pos(rec30dMinF), width: widthCalc(rec30dMinF, rec30dMaxF) }}
                    />

                    {/* Active region between handles */}
                    <div
                        className="absolute top-0 bottom-0 bg-primary/12 border-x border-primary/20"
                        style={{ left: pos(minF), width: widthCalc(minF, maxF) }}
                    />

                    {/* Current price dashed line */}
                    <div
                        className="absolute top-2 bottom-2 w-0 border-l-[1.5px] border-dashed border-slate-400/60 z-10"
                        style={{ left: pos(currentF) }}
                    >
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0 bg-white/90 backdrop-blur-sm border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                            <span className="text-[8px] font-black text-slate-500 whitespace-nowrap uppercase tracking-tight">
                                Spot {currentPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Min Handle */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 cursor-ew-resize"
                        style={{ left: pos(minF) }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onPointerDown={handlePointerDown("min")}
                    >
                        <div className={`w-5 h-10 rounded-md flex items-center justify-center shadow-md transition-all border-2 ${dragging === "min" ? "bg-primary border-primary shadow-primary/30" : "bg-white border-primary/30"}`}>
                            <div className={`w-0.5 h-3 rounded-full ${dragging === "min" ? "bg-white/50" : "bg-primary/20"}`} />
                        </div>
                    </motion.div>

                    {/* Max Handle */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 cursor-ew-resize"
                        style={{ left: pos(maxF) }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onPointerDown={handlePointerDown("max")}
                    >
                        <div className={`w-5 h-10 rounded-md flex items-center justify-center shadow-md transition-all border-2 ${dragging === "max" ? "bg-primary border-primary shadow-primary/30" : "bg-white border-primary/30"}`}>
                            <div className={`w-0.5 h-3 rounded-full ${dragging === "max" ? "bg-white/50" : "bg-primary/20"}`} />
                        </div>
                    </motion.div>
                </div>

                {/* Handle value labels below bar */}
                <div
                    className="absolute bottom-0 -translate-x-1/2 bg-white border border-slate-100 shadow-sm px-2.5 py-1 rounded-lg"
                    style={{ left: pos(minF) }}
                >
                    <span className="text-[10px] font-black text-primary">{priceRange.min.toFixed(2)}</span>
                </div>
                <div
                    className="absolute bottom-0 -translate-x-1/2 bg-white border border-slate-100 shadow-sm px-2.5 py-1 rounded-lg"
                    style={{ left: pos(maxF) }}
                >
                    <span className="text-[10px] font-black text-primary">{priceRange.max.toFixed(2)}</span>
                </div>
            </div>

            {/* Editable inputs */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
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
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <div className="size-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-sm">east</span>
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
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
