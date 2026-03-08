import CustomSelect from "@/components/ui/CustomSelect";
import { formatLabel, TokenEntry } from "@/hooks/useSimulation";

interface Props {
    tokenA: TokenEntry;
    tokenB: TokenEntry;
    isPairProtocol: boolean;
    availableTokenAs: TokenEntry[];
    availableTokenBs: TokenEntry[];
    handleTokenAChange: (symbol: string) => void;
    handleTokenBChange: (symbol: string) => void;
}

export default function TokenSelector({
    tokenA, tokenB,
    isPairProtocol,
    availableTokenAs, availableTokenBs,
    handleTokenAChange, handleTokenBChange,
}: Props) {
    return (
        <div className="space-y-2 flex flex-col justify-end">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isPairProtocol ? 'Token Pair' : 'Token Selection'}
            </label>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <CustomSelect
                        value={tokenA.symbol}
                        onChange={handleTokenAChange}
                        options={availableTokenAs.map(t => ({
                            label: formatLabel(t.symbol, ' / '),
                            value: t.symbol,
                            colorIndicator: t.color
                        }))}
                    />
                </div>
                {isPairProtocol && (
                    <>
                        <div className="text-slate-500 font-bold px-1 flex-shrink-0">
                            <span className="material-symbols-outlined text-[10px] leading-none">close</span>
                        </div>
                        <div className="flex-1">
                            <CustomSelect
                                value={tokenB.symbol}
                                onChange={handleTokenBChange}
                                disabled={availableTokenBs.length === 0}
                                options={availableTokenBs.map(t => ({
                                    label: formatLabel(t.symbol, ' / '),
                                    value: t.symbol,
                                    colorIndicator: t.color
                                }))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
