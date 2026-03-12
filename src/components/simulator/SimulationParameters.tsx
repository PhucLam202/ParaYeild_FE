import CustomSelect from "@/components/ui/CustomSelect";
import { format, subDays, addDays, parseISO } from "date-fns";

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
}

export default function SimulationParameters({
    amount, setAmount,
    timeRange, setTimeRange,
    customRange, setCustomRange,
    slippage, setSlippage,
    compoundYield, setCompoundYield,
    xcmFees, setXcmFees,
}: Props) {
    return (
        <div className="space-y-8">
            {/* Amount */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Capital Allocation (USD)</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl">$</span>
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
                                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
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

                    {/* Compound Yield Toggle */}
                    <div
                        onClick={() => setCompoundYield(!compoundYield)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${compoundYield ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">Compound Yield</span>
                            <span className="text-xs text-slate-500 font-medium">Auto-reinvest rewards</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-12 h-6 rounded-full transition-colors shadow-inner ${compoundYield ? 'bg-primary' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${compoundYield ? 'translate-x-6' : 'translate-x-0'}`}></div>
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
        </div>
    );
}
