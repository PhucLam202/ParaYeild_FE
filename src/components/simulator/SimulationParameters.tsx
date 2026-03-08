import CustomSelect from "@/components/ui/CustomSelect";

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
        <>
            {/* Amount + Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Initial Amount ($)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-8 pr-4 text-white focus:ring-accent-neon focus:border-accent-neon outline-none transition-colors hover:bg-white/10 hover:border-white/20"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <CustomSelect
                                label="Time Range"
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
                        {timeRange === "Custom Range" && (
                            <div className="flex-[1.5] flex gap-2 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-tighter text-slate-500 block px-1">From</label>
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-slate-500 group-hover:text-accent-neon transition-colors">calendar_today</span>
                                        <input
                                            type="date"
                                            value={customRange.from}
                                            onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-accent-neon transition-colors hover:bg-white/10 hover:border-white/20 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-tighter text-slate-500 block px-1">To</label>
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-slate-500 group-hover:text-accent-neon transition-colors">calendar_today</span>
                                        <input
                                            type="date"
                                            value={customRange.to}
                                            onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-accent-neon transition-colors hover:bg-white/10 hover:border-white/20 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Advanced Parameters */}
            <div className="glass-card rounded-xl p-6 space-y-6 md:col-span-2 relative z-10 border-t-0">
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                    <div className="w-1 h-4 rounded-full bg-[#A78BFA]" />
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Advanced Parameters</span>
                    <span className="ml-auto text-xs font-mono text-slate-600 uppercase tracking-widest">Optional</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-slate-300">Slippage Tolerance</label>
                            <span className="text-sm font-mono text-accent-neon">{slippage.toFixed(2)}%</span>
                        </div>
                        <div className="relative">
                        <input
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-neon [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,255,163,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                            style={{ background: `linear-gradient(to right, #00FFA3 ${((slippage - 0.1) / 4.9) * 100}%, rgba(255,255,255,0.1) ${((slippage - 0.1) / 4.9) * 100}%)` }}
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
                        onClick={() => setCompoundYield(!compoundYield)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${compoundYield ? 'bg-accent-neon/5 border-accent-neon/30' : 'bg-white/5 border-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-300">Compound Yield</span>
                            <span className="text-xs text-slate-500">Auto-reinvest rewards</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-11 h-6 rounded-full transition-colors ${compoundYield ? 'bg-accent-neon' : 'bg-white/10'}`}></div>
                            <div className={`absolute left-[2px] top-[2px] bg-black w-5 h-5 rounded-full transition-all ${compoundYield ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div
                        onClick={() => setXcmFees(!xcmFees)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${xcmFees ? 'bg-accent-neon/5 border-accent-neon/30' : 'bg-white/5 border-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-300">XCM Fees Modeling</span>
                            <span className="text-xs text-slate-500">Cross-chain overhead</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className={`w-11 h-6 rounded-full transition-colors ${xcmFees ? 'bg-accent-neon' : 'bg-white/10'}`}></div>
                            <div className={`absolute left-[2px] top-[2px] bg-black w-5 h-5 rounded-full transition-all ${xcmFees ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
