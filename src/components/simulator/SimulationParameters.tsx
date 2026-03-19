"use client";

import { motion } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelect";
import { format, subDays, addDays, parseISO } from "date-fns";
import PriceRangeVisual from "./PriceRangeVisual";

interface Props {
    amount: number;
    setAmount: (v: number) => void;
    timeRange: string;
    setTimeRange: (v: string) => void;
    customRange: { from: string; to: string };
    setCustomRange: (v: { from: string; to: string }) => void;
    slippage: number;
    setSlippage: (v: number) => void;
    compoundYield: boolean;
    setCompoundYield: (v: boolean) => void;
    xcmFees: boolean;
    setXcmFees: (v: boolean) => void;
    isProMode: boolean;
    setIsProMode: (v: boolean) => void;
    showAdvancedOptions: boolean;
    setShowAdvancedOptions: (v: boolean) => void;
    reinvestmentRate: number;
    setReinvestmentRate: (v: number) => void;
    compoundFrequency: "daily" | "weekly" | "monthly";
    setCompoundFrequency: (v: "daily" | "weekly" | "monthly") => void;
    volatilityAssumption: "low" | "medium" | "high";
    setVolatilityAssumption: (v: "low" | "medium" | "high") => void;
    maxAcceptableIl: number | null;
    setMaxAcceptableIl: (v: number | null) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (v: { min: number; max: number }) => void;
    historicalApyAverage: number | null;
    strategyStepCount: number;
}

const VOLATILITY_OPTIONS = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
];

const COMPOUND_FREQUENCY_INFO = {
    daily: { label: "Daily", helper: "365 compounds/year" },
    weekly: { label: "Weekly", helper: "52 compounds/year" },
    monthly: { label: "Monthly", helper: "12 compounds/year" },
};

const COMPOUND_FREQUENCY_TOOLTIP = {
    daily: "≈ daily compounding for max yield",
    weekly: "Compounds once every 7 days",
    monthly: "Compounds once every 30 days",
};

export default function SimulationParameters({
    amount, setAmount,
    timeRange, setTimeRange,
    customRange, setCustomRange,
    slippage, setSlippage,
    compoundYield, setCompoundYield,
    xcmFees, setXcmFees,
    isProMode, setIsProMode,
    showAdvancedOptions, setShowAdvancedOptions,
    reinvestmentRate, setReinvestmentRate,
    compoundFrequency, setCompoundFrequency,
    volatilityAssumption, setVolatilityAssumption,
    maxAcceptableIl, setMaxAcceptableIl,
    priceRange, setPriceRange,
    historicalApyAverage,
    strategyStepCount,
}: Props) {
    const isUnlimitedIl = maxAcceptableIl === null;
    const reinvestmentProgress = Math.max(0, Math.min(100, ((reinvestmentRate - 80) / 20) * 100));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Capital Allocation (USD)</label>
                    <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800 font-black text-xl">$</span>
                        <input
                            className="clay-inset w-full py-3.5 pl-12 pr-6 rounded-3xl font-black text-xl text-slate-800 placeholder:text-slate-300 focus:ring-4 ring-primary/10 transition-all outline-none"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <CustomSelect
                        label="Time Horizon"
                        value={timeRange}
                        onChange={setTimeRange}
                        options={[
                            { label: "90 Days", value: "90 Days" },
                            { label: "180 Days", value: "180 Days" },
                            { label: "1 Year", value: "1 Year" },
                            { label: "Custom Range", value: "Custom Range" }
                        ]}
                    />
                </div>
            </div>

            {timeRange === "Custom Range" && (
                <div className="flex gap-4 p-4 clay-inset rounded-2xl animate-fade-in">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 block">From</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/60">calendar_today</span>
                            <input
                                type="date"
                                value={customRange.from}
                                max={customRange.to ? format(subDays(parseISO(customRange.to), 1), "yyyy-MM-dd") : format(subDays(new Date(), 1), "yyyy-MM-dd")}
                                onChange={(e) => {
                                    const newFrom = e.target.value;
                                    if (newFrom >= customRange.to) {
                                        setCustomRange({ from: newFrom, to: format(addDays(parseISO(newFrom), 1), "yyyy-MM-dd") });
                                    } else {
                                        setCustomRange({ ...customRange, from: newFrom });
                                    }
                                }}
                                className="w-full bg-white/60 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 block">To</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/60">calendar_today</span>
                            <input
                                type="date"
                                value={customRange.to}
                                min={customRange.from ? format(addDays(parseISO(customRange.from), 1), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                                max={format(new Date(), "yyyy-MM-dd")}
                                onChange={(e) => {
                                    const newTo = e.target.value;
                                    if (newTo <= customRange.from) {
                                        setCustomRange({ from: format(subDays(parseISO(newTo), 1), "yyyy-MM-dd"), to: newTo });
                                    } else {
                                        setCustomRange({ ...customRange, to: newTo });
                                    }
                                }}
                                className="w-full bg-white/60 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-clay p-5 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <span className="material-symbols-outlined text-primary font-bold">tune</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Advanced Parameters</span>
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Optional</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-700">Slippage Tolerance</label>
                            <span className="text-sm font-black font-display text-primary">{slippage.toFixed(2)}%</span>
                        </div>
                        <div className="relative pt-2">
                            <input
                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
                                style={{ background: `linear-gradient(to right, #4CAF50 ${((slippage - 0.1) / 4.9) * 100}%, #F1F5F9 ${((slippage - 0.1) / 4.9) * 100}%)` }}
                                type="range"
                                min="0.1"
                                max="5"
                                step="0.1"
                                value={slippage}
                                onChange={(e) => setSlippage(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div
                        onClick={() => { if (!isProMode) setCompoundYield(!compoundYield); }}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${isProMode ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" : `cursor-pointer ${compoundYield ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-slate-50 border-transparent hover:bg-slate-100"}`}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">Compound Yield</span>
                            <span className="text-xs text-slate-500 font-medium">
                                {isProMode ? "Controlled by pro reinvestment settings" : "Auto-reinvest rewards"}
                            </span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-12 h-6 rounded-full transition-colors shadow-inner ${(isProMode ? reinvestmentRate > 0 : compoundYield) ? "bg-primary" : "bg-slate-300"}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${(isProMode ? reinvestmentRate > 0 : compoundYield) ? "translate-x-6" : "translate-x-0"}`}></div>
                        </div>
                    </div>

                    <div
                        onClick={() => setXcmFees(!xcmFees)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${xcmFees ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-slate-50 border-transparent hover:bg-slate-100"}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">XCM Fees</span>
                            <span className="text-xs text-slate-500 font-medium">Cross-chain overhead</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-12 h-6 rounded-full transition-colors shadow-inner ${xcmFees ? "bg-primary" : "bg-slate-300"}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${xcmFees ? "translate-x-6" : "translate-x-0"}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">Advanced Mode</span>
                    <span className="text-xs text-slate-500 font-bold">Show pro simulation controls only when you need them</span>
                </div>
                <motion.button
                    onClick={() => {
                        const nextMode = !isProMode;
                        setIsProMode(nextMode);
                        if (!nextMode) {
                            setShowAdvancedOptions(false);
                        }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all font-black text-[11px] uppercase tracking-widest ${isProMode ? "bg-primary text-white shadow-glow-sm" : "bg-slate-50 text-slate-400 border border-slate-200 hover:border-primary/40 hover:text-primary"}`}
                >
                    <span className="material-symbols-outlined text-sm">{isProMode ? "verified" : "tune"}</span>
                    {isProMode ? "Advanced On" : "Enable Advanced"}
                </motion.button>
            </div>

            {isProMode && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pt-2">
                    <div className="bg-white rounded-clay p-5 md:p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-4 pb-6 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary font-bold text-xl">query_stats</span>
                                </div>
                                <div>
                                    <span className="text-base font-black uppercase tracking-[0.1em] text-slate-800">Pro Simulation Config</span>
                                    <p className="text-sm text-slate-500 font-medium">Core loop settings stay visible by default. Open advanced controls only for scenario tuning.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${showAdvancedOptions ? "border-primary/20 bg-primary/10 text-primary" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-primary/30 hover:text-primary"}`}
                            >
                                <span className="material-symbols-outlined text-sm">{showAdvancedOptions ? "remove" : "add"}</span>
                                {showAdvancedOptions ? "Hide Advanced" : "Advanced"}
                                {strategyStepCount > 0 && (
                                    <span className="rounded-full bg-white/80 px-2 py-1 text-[9px] text-slate-500">
                                        {strategyStepCount} step{strategyStepCount > 1 ? "s" : ""}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 pt-6">
                            <div className="space-y-4">
                                <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">APY</label>
                                    <p className="text-lg font-black text-slate-800">Using historical ~{historicalApyAverage?.toFixed(1) ?? "—"}%</p>
                                    <p className="mt-2 text-sm text-slate-500 font-medium">Manual APY override has been removed from the default flow to keep simulations grounded in historical data.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Reinvestment</label>
                                                <p className="text-sm text-slate-500 font-medium">Defaulted to near-full compounding for yield-loop scenarios.</p>
                                            </div>
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">{reinvestmentRate}%</span>
                                        </div>
                                        <input
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
                                            style={{ background: `linear-gradient(to right, #4CAF50 ${reinvestmentProgress}%, #F1F5F9 ${reinvestmentProgress}%)` }}
                                            type="range"
                                            min="80"
                                            max="100"
                                            step="5"
                                            value={reinvestmentRate}
                                            onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                                        />
                                        <div className="flex justify-end text-[11px] font-black uppercase tracking-wider text-slate-400">
                                            <span>100% Full</span>
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Compound</label>
                                                <p className="text-lg font-black text-slate-800">{COMPOUND_FREQUENCY_INFO[compoundFrequency].label}</p>
                                            </div>
                                            <span
                                                title={COMPOUND_FREQUENCY_TOOLTIP[compoundFrequency]}
                                                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500"
                                            >
                                                {COMPOUND_FREQUENCY_INFO[compoundFrequency].helper}
                                                <span className="material-symbols-outlined text-sm text-slate-400">info</span>
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(Object.keys(COMPOUND_FREQUENCY_INFO) as Array<keyof typeof COMPOUND_FREQUENCY_INFO>).map((frequency) => (
                                                <button
                                                    key={frequency}
                                                    type="button"
                                                    onClick={() => setCompoundFrequency(frequency)}
                                                    className={`rounded-2xl border px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${compoundFrequency === frequency ? "border-primary/20 bg-primary/10 text-primary" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-primary/30 hover:text-primary"}`}
                                                >
                                                    {COMPOUND_FREQUENCY_INFO[frequency].label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <PriceRangeVisual
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                onAutoFill={() => setPriceRange({ min: 0.95, max: 1.05 })}
                            />
                        </div>

                        {showAdvancedOptions && (
                            <div className="mt-8 border-t border-slate-100 pt-6 space-y-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">settings_suggest</span>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Advanced Options</h3>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
                                        <CustomSelect
                                            label="Volatility Assumption"
                                            value={volatilityAssumption}
                                            onChange={(value) => setVolatilityAssumption(value as "low" | "medium" | "high")}
                                            options={VOLATILITY_OPTIONS}
                                        />
                                        <p className="mt-3 px-1 text-sm text-slate-500 font-medium">
                                            Medium stays as the default. Switch to Low or High only when stress-testing a different price regime.
                                        </p>
                                    </div>

                                    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5 flex items-start justify-between gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Max IL Loss</label>
                                            <p className="text-sm text-slate-500 font-medium">
                                                Unlimited is the default. Switch it off only if you want a fixed 25% IL cap for a stop-loss style simulation.
                                            </p>
                                            {!isUnlimitedIl && (
                                                <span className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                                                    25% cap active
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setMaxAcceptableIl(isUnlimitedIl ? 25 : null)}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors hover:border-primary/30 hover:text-primary"
                                        >
                                            <span className={`material-symbols-outlined text-sm ${isUnlimitedIl ? "text-primary" : "text-slate-400"}`}>{isUnlimitedIl ? "all_inclusive" : "do_not_disturb_on"}</span>
                                            {isUnlimitedIl ? "Unlimited" : "Limit IL"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
