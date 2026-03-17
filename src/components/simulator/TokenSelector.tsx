import CustomSelect from "@/components/ui/CustomSelect";
import { formatLabel, TokenEntry } from "@/hooks/useSimulation";
import type { LpFarmPool } from "@/types/simulator";

interface Props {
    tokenA: TokenEntry;
    tokenB: TokenEntry;
    isPairProtocol: boolean;
    availableTokenAs: TokenEntry[];
    availableTokenBs: TokenEntry[];
    handleTokenAChange: (symbol: string) => void;
    handleTokenBChange: (symbol: string) => void;
    selectedPool?: LpFarmPool | null;
}

export default function TokenSelector({
    tokenA, tokenB,
    isPairProtocol,
    availableTokenAs, availableTokenBs,
    handleTokenAChange, handleTokenBChange,
    selectedPool
}: Props) {
    return (
        <div className="space-y-2 flex flex-col justify-end">
            <div className="relative ml-4 mb-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {isPairProtocol ? 'Token Pair' : 'Asset Pair'}
                </label>
                {selectedPool && (selectedPool.totalApy != null || selectedPool.supplyApy != null) && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm border border-emerald-200">
                        <span className="material-symbols-outlined text-[10px]">local_fire_department</span>
                        {(selectedPool.totalApy ?? ((selectedPool.supplyApy || 0) + (selectedPool.rewardApy || 0))).toFixed(2)}% APY
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <CustomSelect
                        value={tokenA.symbol}
                        onChange={handleTokenAChange}
                        options={availableTokenAs.map(t => ({
                            label: formatLabel(t.symbol, ' / '),
                            value: t.symbol,
                            colorIndicator: !t.iconPath ? t.color : undefined,
                            icon: t.iconPath ? <img src={t.iconPath} className="w-5 h-5 object-contain" alt={t.symbol} /> : undefined
                        }))}
                    />
                </div>
                {isPairProtocol && (
                    <>
                        <div className="text-slate-300 font-black px-2 flex-shrink-0 text-lg">
                            /
                        </div>
                        <div className="flex-1">
                            <CustomSelect
                                value={tokenB.symbol}
                                onChange={handleTokenBChange}
                                disabled={availableTokenBs.length === 0}
                                options={availableTokenBs.map(t => ({
                                    label: formatLabel(t.symbol, ' / '),
                                    value: t.symbol,
                                    colorIndicator: !t.iconPath ? t.color : undefined,
                                    icon: t.iconPath ? <img src={t.iconPath} className="w-5 h-5 object-contain" alt={t.symbol} /> : undefined
                                }))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
