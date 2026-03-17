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
    // Pro Mode
    isProMode: boolean;
    setIsProMode: (v: boolean) => void;
    baseApyOverride: number | null;
    setBaseApyOverride: (v: number | null) => void;
    reinvestmentRate: number;
    setReinvestmentRate: (v: number) => void;
    volatilityAssumption: 'low' | 'medium' | 'high';
    setVolatilityAssumption: (v: 'low' | 'medium' | 'high') => void;
    maxAcceptableIl: number | null;
    setMaxAcceptableIl: (v: number | null) => void;
    compoundFrequency: 'daily' | 'weekly' | 'monthly';
    setCompoundFrequency: (v: 'daily' | 'weekly' | 'monthly') => void;
    priceRange: { min: number; max: number };
    setPriceRange: (v: { min: number; max: number }) => void;
    historicalApyAverage: number | null;
}

const VOLATILITY_CONFIG = [
    { value: 'low' as const, label: 'Low', icon: 'shield', color: 'bg-green-50 text-green-600 border-green-200', activeRing: 'ring-green-400', iconBg: 'bg-green-100', description: 'Lower IL risk' },
    { value: 'medium' as const, label: 'Medium', icon: 'scale', color: 'bg-amber-50 text-amber-600 border-amber-200', activeRing: 'ring-amber-400', iconBg: 'bg-amber-100', description: 'Balanced' },
    { value: 'high' as const, label: 'High', icon: 'warning', color: 'bg-red-50 text-red-600 border-red-200', activeRing: 'ring-red-400', iconBg: 'bg-red-100', description: 'Higher yield, more IL' },
];

const REINVESTMENT_PRESETS = [
    { label: '0% Keep', value: 0 },
    { label: '50%', value: 50 },
    { label: '100% Full', value: 100 },
    { label: 'Custom', value: -1 },
];

const COMPOUND_INFO: Record<string, string> = {
    daily: '365 compounds/year',
    weekly: '52 compounds/year',
    monthly: '12 compounds/year',
};

export default function SimulationParameters({
    amount, setAmount,
    timeRange, setTimeRange,
    customRange, setCustomRange,
    slippage, setSlippage,
    compoundYield, setCompoundYield,
    xcmFees, setXcmFees,
    isProMode, setIsProMode,
    baseApyOverride, setBaseApyOverride,
    reinvestmentRate, setReinvestmentRate,
    volatilityAssumption, setVolatilityAssumption,
    maxAcceptableIl, setMaxAcceptableIl,
    compoundFrequency, setCompoundFrequency,
    priceRange, setPriceRange,
    historicalApyAverage,
}: Props) {
    const isApyOverrideEnabled = baseApyOverride !== null;
    const isUnlimitedIl = maxAcceptableIl === null;
    const isCustomReinvestment = !REINVESTMENT_PRESETS.slice(0, 3).some(p => p.value === reinvestmentRate);

    return (
        <div className="space-y-8">
            {/* Amount */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Capital Allocation (USD)</label>
                    <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800 font-black text-2xl">$</span>
                        <input
                            className="clay-inset w-full py-4 pl-12 pr-6 rounded-3xl font-black text-2xl text-slate-800 placeholder:text-slate-300 focus:ring-4 ring-primary/10 transition-all outline-none"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Time Range */}
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
                                max={customRange.to ? format(subDays(parseISO(customRange.to), 1), 'yyyy-MM-dd') : format(subDays(new Date(), 1), 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    const newFrom = e.target.value;
                                    if (newFrom >= customRange.to) {
                                        setCustomRange({ from: newFrom, to: format(addDays(parseISO(newFrom), 1), 'yyyy-MM-dd') });
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
                                min={customRange.from ? format(addDays(parseISO(customRange.from), 1), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                                max={format(new Date(), 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    const newTo = e.target.value;
                                    if (newTo <= customRange.from) {
                                        setCustomRange({ from: format(subDays(parseISO(newTo), 1), 'yyyy-MM-dd'), to: newTo });
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

            {/* Advanced Parameters */}
            <div className="bg-white rounded-clay p-6 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <span className="material-symbols-outlined text-primary font-bold">tune</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Advanced Parameters</span>
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Optional</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Slippage Slider */}
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

                    {/* Compound Yield Toggle — disabled when Pro Mode controls it */}
                    <div
                        onClick={() => { if (!isProMode) setCompoundYield(!compoundYield); }}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${isProMode ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' : `cursor-pointer ${compoundYield ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">Compound Yield</span>
                            <span className="text-xs text-slate-500 font-medium">
                                {isProMode ? 'Controlled by Pro Mode reinvestment rate' : 'Auto-reinvest rewards'}
                            </span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-12 h-6 rounded-full transition-colors shadow-inner ${(isProMode ? reinvestmentRate > 0 : compoundYield) ? 'bg-primary' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${(isProMode ? reinvestmentRate > 0 : compoundYield) ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    {/* XCM Fees Toggle */}
                    <div
                        onClick={() => setXcmFees(!xcmFees)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${xcmFees ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">XCM Fees</span>
                            <span className="text-xs text-slate-500 font-medium">Cross-chain overhead</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-12 h-6 rounded-full transition-colors shadow-inner ${xcmFees ? 'bg-primary' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${xcmFees ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Mode Toggle */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">Expert Mode</span>
                    <span className="text-xs text-slate-500 font-bold">Unlock advanced mathematical parameters</span>
                </div>
                <motion.button
                    onClick={() => setIsProMode(!isProMode)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all font-black text-[11px] uppercase tracking-widest ${isProMode ? 'bg-primary text-white shadow-glow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-primary/40 hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined text-sm">{isProMode ? 'verified' : 'tune'}</span>
                    {isProMode ? 'PRO MODE ACTIVE' : 'Enable Pro Mode'}
                </motion.button>
            </div>

            {isProMode && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pt-2">
                    <div className="bg-white rounded-clay p-8 shadow-sm border border-slate-100 relative group">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-clay">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                <span className="material-symbols-outlined text-[120px] text-primary">monitoring</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pb-6 border-b border-slate-50 mb-8">
                            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary font-bold text-xl">query_stats</span>
                            </div>
                            <span className="text-base font-black uppercase tracking-[0.1em] text-slate-800">Pro Simulation Config</span>
                            <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">Advanced</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {/* Column 1 — APY Override + Compound Frequency */}
                            <div className="space-y-6">
                                {/* APY Override */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Base APY Override</label>
                                        <button
                                            onClick={() => setBaseApyOverride(isApyOverrideEnabled ? null : (historicalApyAverage ?? 12))}
                                            className={`relative inline-flex items-center cursor-pointer`}
                                        >
                                            <div className={`w-10 h-5 rounded-full transition-colors shadow-inner ${isApyOverrideEnabled ? 'bg-primary' : 'bg-slate-300'}`} />
                                            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${isApyOverrideEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    {isApyOverrideEnabled ? (
                                        <div className="relative">
                                            <input
                                                className="w-full bg-slate-50 border border-slate-100 py-4 px-5 rounded-2xl font-black text-slate-800 placeholder:text-slate-300 outline-none focus:ring-4 ring-primary/5 transition-all"
                                                type="number"
                                                placeholder="Enter APY %"
                                                value={baseApyOverride || ''}
                                                onChange={(e) => setBaseApyOverride(e.target.value ? Number(e.target.value) : null)}
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black">%</span>
                                        </div>
                                    ) : (
                                        <div className="clay-inset rounded-2xl py-3.5 px-5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                                            <span className="text-sm font-bold text-slate-600">
                                                Using historical ~{historicalApyAverage?.toFixed(1) ?? '—'}%
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-slate-400 px-2 italic font-medium">
                                        {isApyOverrideEnabled ? 'Manual override active' : 'Based on pool historical averages'}
                                    </p>
                                </div>

                                {/* Compound Frequency */}
                                <div className="space-y-3">
                                    <CustomSelect
                                        label="Compound Frequency"
                                        value={compoundFrequency}
                                        onChange={(v) => setCompoundFrequency(v as 'daily' | 'weekly' | 'monthly')}
                                        options={[
                                            { label: "Daily (Optimal)", value: "daily" },
                                            { label: "Weekly", value: "weekly" },
                                            { label: "Monthly", value: "monthly" }
                                        ]}
                                    />
                                    <p className="text-[10px] text-slate-400 px-2 font-medium">
                                        Est. {COMPOUND_INFO[compoundFrequency]}
                                    </p>
                                </div>
                            </div>

                            {/* Column 2 — Reinvestment Rate */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Reinvestment Rate (%)</label>
                                <div className="relative pt-4 px-2">
                                    <input
                                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
                                        style={{ background: `linear-gradient(to right, #4CAF50 ${reinvestmentRate}%, #F1F5F9 ${reinvestmentRate}%)` }}
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={reinvestmentRate}
                                        onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                                    />
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">0% (Keep)</span>
                                        <span className="text-xs text-primary font-black">{reinvestmentRate}%</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">100% (Full)</span>
                                    </div>
                                </div>
                                {/* Segmented control */}
                                <div className="clay-inset rounded-2xl p-1.5 flex gap-1">
                                    {REINVESTMENT_PRESETS.map((preset) => {
                                        const isActive = preset.value === -1
                                            ? isCustomReinvestment
                                            : reinvestmentRate === preset.value;
                                        return (
                                            <motion.button
                                                key={preset.label}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    if (preset.value !== -1) setReinvestmentRate(preset.value);
                                                }}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {preset.label}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                {isCustomReinvestment && (
                                    <div className="flex items-center gap-2 px-2">
                                        <input
                                            className="w-20 bg-white border border-slate-100 py-2 px-3 rounded-xl text-sm font-black text-slate-800 outline-none focus:ring-2 ring-primary/10"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={reinvestmentRate}
                                            onChange={(e) => setReinvestmentRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                                        />
                                        <span className="text-xs font-bold text-slate-400">% custom</span>
                                    </div>
                                )}
                            </div>

                            {/* Column 3 — Volatility + Max IL Loss */}
                            <div className="space-y-6">
                                {/* Volatility Radio Cards */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 ml-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Volatility Assumption</label>
                                        <span title="Higher volatility increases expected Impermanent Loss" className="material-symbols-outlined text-[14px] text-slate-300 cursor-help hover:text-primary transition-colors">info</span>
                                    </div>
                                    <div className="space-y-2">
                                        {VOLATILITY_CONFIG.map((v) => {
                                            const isSelected = volatilityAssumption === v.value;
                                            return (
                                                <motion.button
                                                    key={v.value}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setVolatilityAssumption(v.value)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 border ${isSelected ? `${v.color} ring-2 ${v.activeRing} bg-opacity-100 shadow-sm` : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? v.iconBg : 'bg-slate-100'}`}>
                                                        <span className="material-symbols-outlined text-lg">{v.icon}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? '' : 'text-slate-500'}`}>{v.label}</span>
                                                        <p className={`text-[10px] font-medium ${isSelected ? 'opacity-80' : 'text-slate-400'}`}>{v.description}</p>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Max IL Loss */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-2">
                                        <div className="flex items-center gap-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Max IL Loss</label>
                                            <span title="Simulates a stop-loss or hedging strategy to cap losses" className="material-symbols-outlined text-[14px] text-slate-300 cursor-help hover:text-primary transition-colors">info</span>
                                        </div>
                                        {/* Unlimited toggle */}
                                        <button
                                            onClick={() => setMaxAcceptableIl(isUnlimitedIl ? 25 : null)}
                                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                                        >
                                            <span className={`transition-colors ${isUnlimitedIl ? 'text-primary' : 'text-slate-400'}`}>
                                                {isUnlimitedIl ? '∞' : ''} Unlimited
                                            </span>
                                            <div className={`relative w-8 h-4 rounded-full transition-colors shadow-inner ${isUnlimitedIl ? 'bg-primary' : 'bg-slate-300'}`}>
                                                <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${isUnlimitedIl ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        </button>
                                    </div>
                                    <div className="relative pt-2 px-2">
                                        <input
                                            className={`w-full h-1.5 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm focus:outline-none transition-opacity ${isUnlimitedIl ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                            style={{ background: isUnlimitedIl ? '#F1F5F9' : `linear-gradient(to right, #EF4444 ${((maxAcceptableIl ?? 0) / 50) * 100}%, #F1F5F9 ${((maxAcceptableIl ?? 0) / 50) * 100}%)` }}
                                            type="range"
                                            min="1"
                                            max="50"
                                            step="1"
                                            value={maxAcceptableIl ?? 25}
                                            disabled={isUnlimitedIl}
                                            onChange={(e) => setMaxAcceptableIl(Number(e.target.value))}
                                        />
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[10px] text-slate-400 font-bold">1%</span>
                                            <span className={`text-xs font-black ${isUnlimitedIl ? 'text-slate-300' : 'text-red-500'}`}>
                                                {isUnlimitedIl ? '∞ Unlimited' : `${maxAcceptableIl}%`}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold">50%</span>
                                        </div>
                                    </div>
                                    {!isUnlimitedIl && (maxAcceptableIl ?? 0) < 10 && (
                                        <div className="flex items-center gap-1.5 px-2 text-amber-500">
                                            <span className="material-symbols-outlined text-sm">warning</span>
                                            <span className="text-[10px] font-bold">Simulation may stop early at low thresholds</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Range — full width */}
                            <PriceRangeVisual
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                onAutoFill={() => setPriceRange({ min: 0.95, max: 1.05 })}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
