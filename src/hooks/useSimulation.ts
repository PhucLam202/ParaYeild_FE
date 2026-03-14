"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { format, subDays } from "date-fns";
import {
    simulatorService,
} from "@/services/simulatorService";
import { TOKEN_CONFIG, getTokenConfig } from "@/constants/tokens";
import type {
    SimulationResponse,
    SimulationRequest,
    SuggestStrategiesResponse,
    SuggestedStrategy,
    BacktestMetadataResponse,
    SimulationAllocation,
    PoolTypeDetail,
    StrategyTypeDetail,
    ChartMetricType,
} from "@/types/simulator";

export const formatLabel = (str: string, separator: string = ' ') => {
    if (!str) return "";
    if (str.includes('-') || str.includes('_')) {
        return str
            .split(/[_-]/)
            .map(word => {
                const lower = word.toLowerCase();
                if (['lp', 'blp', 'dex', 'xcm', 'dot', 'ksm', 'usdc', 'usdt'].includes(lower)) return word.toUpperCase();
                if (/[a-z]/.test(word) && /[A-Z]/.test(word)) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(separator);
    }
    const lower = str.toLowerCase();
    if (['lp', 'blp', 'dex', 'xcm', 'dot', 'ksm', 'usdc', 'usdt'].includes(lower)) return str.toUpperCase();
    if (/[a-z]/.test(str) && /[A-Z]/.test(str)) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const DEFAULT_TOKENS = [
    { symbol: "DOT", color: TOKEN_CONFIG.DOT.color, iconPath: TOKEN_CONFIG.DOT.iconPath },
    { symbol: "vDOT", color: TOKEN_CONFIG.VDOT.color, iconPath: TOKEN_CONFIG.VDOT.iconPath },
    { symbol: "USDC", color: TOKEN_CONFIG.USDC.color, iconPath: TOKEN_CONFIG.USDC.iconPath },
    { symbol: "USDT", color: TOKEN_CONFIG.USDT.color, iconPath: TOKEN_CONFIG.USDT.iconPath },
    { symbol: "LDOT", color: TOKEN_CONFIG.LDOT.color, iconPath: TOKEN_CONFIG.LDOT.iconPath },
    { symbol: "ACA", color: TOKEN_CONFIG.ACA.color },
];

export const HODL_RETURN_PERCENT = 3.5;

export type TokenEntry = { symbol: string; color: string; poolTypes?: string[]; iconPath?: string };

export interface SimulationState {
    // Network & protocol
    network: string;
    setNetwork: (v: string) => void;
    protocol: string;
    setProtocol: (v: string) => void;
    // Tokens
    tokenA: TokenEntry;
    setTokenA: (v: TokenEntry) => void;
    tokenB: TokenEntry;
    setTokenB: (v: TokenEntry) => void;
    isPairProtocol: boolean;
    availableTokenAs: TokenEntry[];
    availableTokenBs: TokenEntry[];
    handleTokenAChange: (symbol: string) => void;
    handleTokenBChange: (symbol: string) => void;
    // Parameters
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
    // Chart
    chartMetric: ChartMetricType;
    setChartMetric: (v: ChartMetricType) => void;
    hoveredPoint: number | null;
    setHoveredPoint: (v: number | null) => void;
    // Simulation state
    isSimulating: boolean;
    isSuggesting: boolean;
    simulationSteps: string[];
    currentStepIndex: number;
    showSuccessPulse: boolean;
    isLoadingInitial: boolean;
    simulationResult: SimulationResponse | null;
    suggestedStrategies: SuggestStrategiesResponse | null;
    toastState: { message: string; type: 'error' | 'success' | 'info' | 'warning' } | null;
    setToastState: (v: { message: string; type: 'error' | 'success' | 'info' | 'warning' } | null) => void;
    selectedStrategyForModal: SuggestedStrategy | null;
    setSelectedStrategyForModal: (v: SuggestedStrategy | null) => void;
    // API data
    fetchedTokens: TokenEntry[];
    fetchedParachains: { id: string; name: string }[];
    fetchedProtocols: { id: string; label: string }[];
    poolTypeDetails: Record<string, PoolTypeDetail>;
    strategyTypeDetails: Record<string, StrategyTypeDetail>;
    // Derived
    dateRange: { from: string; to: string };
    // Handlers
    handleRunSimulation: (customAllocations?: SimulationAllocation[]) => Promise<void>;
    handleSuggestStrategies: (refresh?: boolean) => Promise<void>;
    handleSelectStrategy: (strategy: SuggestedStrategy, shouldRun?: boolean) => void;
}

export function useSimulation(): SimulationState {
    const [network, setNetwork] = useState("");
    const [protocol, setProtocol] = useState("");
    const [tokenA, setTokenA] = useState<TokenEntry>({ symbol: "DOT", color: "polkadot-gradient" });
    const [tokenB, setTokenB] = useState<TokenEntry>({ symbol: "vDOT", color: "bg-pink-500" });
    const [isPairProtocol, setIsPairProtocol] = useState(true);
    const [amount, setAmount] = useState(10000);
    const [timeRange, setTimeRange] = useState("90 Days");
    const [customRange, setCustomRange] = useState({
        from: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd'),
    });
    const [slippage, setSlippage] = useState(0.5);
    const [compoundYield, setCompoundYield] = useState(true);
    const [xcmFees, setXcmFees] = useState(true);
    const [chartMetric, setChartMetric] = useState<ChartMetricType>("value");

    const [isSimulating, setIsSimulating] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [showSuccessPulse, setShowSuccessPulse] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
    const [suggestedStrategies, setSuggestedStrategies] = useState<SuggestStrategiesResponse | null>(null);
    const [toastState, setToastState] = useState<{ message: string; type: 'error' | 'success' | 'info' | 'warning' } | null>(null);
    const [selectedStrategyForModal, setSelectedStrategyForModal] = useState<SuggestedStrategy | null>(null);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    const [metadata, setMetadata] = useState<BacktestMetadataResponse | null>(null);
    const [fetchedTokens, setFetchedTokens] = useState<TokenEntry[]>(DEFAULT_TOKENS);
    const [fetchedParachains, setFetchedParachains] = useState<{ id: string; name: string }[]>([]);
    const [fetchedProtocols, setFetchedProtocols] = useState<{ id: string; label: string }[]>([]);
    const [availableTokenAs, setAvailableTokenAs] = useState<TokenEntry[]>([]);
    const [availableTokenBs, setAvailableTokenBs] = useState<TokenEntry[]>([]);
    const [poolTypeDetails, setPoolTypeDetails] = useState<Record<string, PoolTypeDetail>>({});
    const [strategyTypeDetails, setStrategyTypeDetails] = useState<Record<string, StrategyTypeDetail>>({});

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const data = await simulatorService.getBacktestMetadata();
                setMetadata(data);
                if (data.enums) {
                    setPoolTypeDetails(data.enums.poolTypeDetails ?? {});
                    setStrategyTypeDetails(data.enums.strategyTypeDetails ?? {});
                }
                const parachains = data.protocols.map(p => ({ id: p, name: p }));
                setFetchedParachains(parachains);
                if (parachains.length > 0) setNetwork(parachains[0].id);
            } catch (err) {
                console.error("Failed to load metadata", err);
                setIsLoadingInitial(false);
            }
        };
        loadMetadata();
    }, []);

    useEffect(() => {
        if (!network || !metadata) return;
        setIsLoadingInitial(true);
        const fallbackColors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
        const tokensData = metadata.mappings[network] || [];
        const mappedTokens = tokensData.map((t, i) => {
            const config = getTokenConfig(t.symbol);
            return {
                symbol: t.symbol,
                poolTypes: t.poolTypes,
                color: config.color,
                iconPath: config.iconPath
            };
        });
        setFetchedTokens(mappedTokens);

        const allProtocols = new Set<string>();
        mappedTokens.forEach(t => (t.poolTypes ?? []).forEach((p: string) => allProtocols.add(p)));
        const protocols = Array.from(allProtocols)
            .filter((p: string) => p !== 'single_farming')
            .map((p: string) => ({ id: p, label: poolTypeDetails[p]?.label || formatLabel(p) }));
        setFetchedProtocols(protocols);

        if (protocols.length > 0 && !protocols.find(p => p.id === protocol)) {
            setProtocol(protocols[0].id);
        }
        setIsLoadingInitial(false);
    }, [network, metadata, protocol, poolTypeDetails]);

    useEffect(() => {
        setIsPairProtocol(protocol === 'blp_farm' || protocol === 'lp_farm');
        let validTokenAs: TokenEntry[] = [];
        if (protocol === 'blp_farm' || protocol === 'lp_farm') {
            const baseTokensMap = new Map<string, TokenEntry>();
            fetchedTokens.forEach(t => {
                if (t.poolTypes?.includes(protocol) && t.symbol.includes('-')) {
                    const baseSymbol = t.symbol.split('-')[0];
                    if (!baseTokensMap.has(baseSymbol)) {
                        const config = getTokenConfig(baseSymbol);
                        baseTokensMap.set(baseSymbol, {
                            symbol: baseSymbol,
                            color: config.color,
                            poolTypes: t.poolTypes,
                            iconPath: config.iconPath
                        });
                    }
                }
            });
            validTokenAs = Array.from(baseTokensMap.values());
        } else {
            validTokenAs = fetchedTokens.filter(t => t.poolTypes?.includes(protocol) && !t.symbol.includes('-'));
        }
        setAvailableTokenAs(validTokenAs);
        if (validTokenAs.length > 0 && !validTokenAs.find(t => t.symbol === tokenA.symbol)) {
            setTokenA(validTokenAs[0]);
        }
    }, [protocol, fetchedTokens]);

    useEffect(() => {
        if (!isPairProtocol) return;
        const validTokenBs = fetchedTokens
            .filter(t => t.poolTypes?.includes(protocol) && t.symbol.startsWith(`${tokenA.symbol}-`))
            .map(t => {
                const quoteSymbol = t.symbol.split('-').slice(1).join('-');
                const config = getTokenConfig(quoteSymbol);
                return {
                    symbol: quoteSymbol,
                    color: config.color,
                    poolTypes: t.poolTypes,
                    iconPath: config.iconPath
                };
            });
        setAvailableTokenBs(validTokenBs);
        if (validTokenBs.length > 0 && !validTokenBs.find(t => t.symbol === tokenB.symbol)) {
            setTokenB(validTokenBs[0]);
        } else if (validTokenBs.length === 0) {
            setAvailableTokenBs([]);
        }
    }, [tokenA.symbol, protocol, isPairProtocol, fetchedTokens]);

    // Pre-fill from URL params (e.g. from "Simulate" button on pools table)
    const hasAppliedUrlParams = useRef(false);
    useEffect(() => {
        if (hasAppliedUrlParams.current || !metadata || typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const urlNetwork = params.get('network');
        const urlPoolType = params.get('poolType');
        const urlAsset = params.get('asset');
        const urlProtocol = params.get('protocol');
        if (!urlNetwork && !urlPoolType && !urlAsset && !urlProtocol) return;
        hasAppliedUrlParams.current = true;

        if (urlProtocol || urlNetwork) setNetwork(urlProtocol || urlNetwork || '');
        if (urlPoolType) setProtocol(urlPoolType);
        if (urlAsset) {
            const isPair = urlPoolType === 'blp_farm' || urlPoolType === 'lp_farm';
            if (isPair && urlAsset.includes('-')) {
                const [base, ...rest] = urlAsset.split('-');
                const quote = rest.join('-');
                const baseConfig = getTokenConfig(base);
                const quoteConfig = getTokenConfig(quote);
                setTokenA({ symbol: base, color: baseConfig.color, iconPath: baseConfig.iconPath });
                setTokenB({ symbol: quote, color: quoteConfig.color, iconPath: quoteConfig.iconPath });
            } else {
                const config = getTokenConfig(urlAsset);
                setTokenA({ symbol: urlAsset, color: config.color, iconPath: config.iconPath });
            }
        }
    }, [metadata]);

    const dateRange = useMemo(() => {
        const today = new Date();
        let fromDate = new Date();
        switch (timeRange) {
            case "90 Days": fromDate = subDays(today, 90); break;
            case "180 Days": fromDate = subDays(today, 180); break;
            case "1 Year": fromDate = subDays(today, 365); break;
            case "Custom Range":
                if (customRange.from && customRange.to && customRange.from < customRange.to) {
                    return { from: customRange.from, to: customRange.to };
                }
                // fallback: last 2 days
                return {
                    from: format(subDays(today, 2), 'yyyy-MM-dd'),
                    to: format(today, 'yyyy-MM-dd'),
                };
        }
        return { from: format(fromDate, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') };
    }, [timeRange, customRange]);

    const handleTokenAChange = (symbol: string) => {
        const token = availableTokenAs.find(t => t.symbol === symbol);
        if (token) setTokenA(token);
    };

    const handleTokenBChange = (symbol: string) => {
        const token = availableTokenBs.find(t => t.symbol === symbol);
        if (token) setTokenB(token);
    };

    const handleRunSimulation = async (customAllocations?: SimulationAllocation[]) => {
        setIsSimulating(true);
        setToastState(null);
        setSimulationSteps([
            "Analyzing parachain liquidity...",
            "Fetching historical yield rates...",
            "Calculating XCM overhead...",
            "Optimizing token allocation...",
            "Finalizing simulation results..."
        ]);
        setCurrentStepIndex(0);
        try {
            for (let i = 0; i < 5; i++) {
                await new Promise(resolve => setTimeout(resolve, i === 4 ? 200 : 800));
                setCurrentStepIndex(i + 1);
            }
            const isSingleAsset = !isPairProtocol;
            const finalAssetSymbol = isPairProtocol ? `${tokenA.symbol}-${tokenB.symbol}` : tokenA.symbol;
            const request: SimulationRequest = {
                initialAmountUsd: amount,
                from: dateRange.from,
                to: dateRange.to,
                includeIL: !isSingleAsset,
                xcmFeeUsd: xcmFees ? 0.5 : 0,
                isCompound: compoundYield,
                compoundFrequencyDays: compoundYield ? 7 : undefined,
                compoundFeeUsd: compoundYield ? 0.5 : undefined,
                slippageTolerancePercent: slippage,
                rebalanceIntervalDays: 0,
                allocations: customAllocations || [{
                    protocol: network,
                    assetSymbol: finalAssetSymbol,
                    percentage: 100,
                    poolType: protocol
                }]
            };
            const result = await simulatorService.runSimulation(request);
            setSimulationResult(result);
            setShowSuccessPulse(true);
            setTimeout(() => setShowSuccessPulse(false), 2000);
            setToastState({ message: "Simulation completed successfully!", type: "success" });
            setTimeout(() => {
                document.getElementById('simulation-results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err: unknown) {
            const error = err as Error;
            setToastState({ message: error.message || "An error occurred during simulation.", type: "error" });
            setSimulationSteps(["Simulation failed. Please check your inputs."]);
        } finally {
            setIsSimulating(false);
            setCurrentStepIndex(-1);
        }
    };

    const handleSuggestStrategies = async (refresh = false) => {
        setIsSuggesting(true);
        setToastState(null);
        try {
            const fetchPromise = refresh
                ? simulatorService.suggestStrategies(undefined, undefined, true)
                : simulatorService.suggestStrategies("medium", 10, true);
            const [response] = await Promise.all([
                fetchPromise,
                new Promise(resolve => setTimeout(resolve, 1500))
            ]);
            setSuggestedStrategies(response);
            setToastState({ message: "AI suggestions updated successfully!", type: "success" });
        } catch (err: unknown) {
            const error = err as Error;
            setToastState({ message: error.message || "Failed to get suggestions. The OpenAI service may be unavailable.", type: "error" });
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSelectStrategy = (strategy: SuggestedStrategy, shouldRun = false) => {
        if (!shouldRun) {
            setSelectedStrategyForModal(strategy);
            return;
        }
        if (strategy.allocations.length > 0) {
            const first = strategy.allocations[0];
            setNetwork(first.protocol);
            setProtocol(first.poolType);
            const isPair = first.poolType === 'blp_farm' || first.poolType === 'lp_farm';
            if (isPair && first.assetSymbol.includes('-')) {
                const baseSymbol = first.assetSymbol.split('-')[0];
                const quoteSymbol = first.assetSymbol.split('-').slice(1).join('-');
                setTokenA({ symbol: baseSymbol, color: DEFAULT_TOKENS.find(t => t.symbol === baseSymbol)?.color || "bg-blue-500" });
                setTokenB({ symbol: quoteSymbol, color: DEFAULT_TOKENS.find(t => t.symbol === quoteSymbol)?.color || "bg-pink-500" });
            } else {
                const matchedToken = fetchedTokens.find(t => t.symbol === first.assetSymbol);
                if (matchedToken) setTokenA(matchedToken);
            }
            handleRunSimulation(strategy.allocations.map(a => ({
                protocol: a.protocol,
                assetSymbol: a.assetSymbol,
                percentage: a.percentage,
                poolType: a.poolType
            })));
        }
    };

    return {
        network, setNetwork,
        protocol, setProtocol,
        tokenA, setTokenA,
        tokenB, setTokenB,
        isPairProtocol,
        availableTokenAs, availableTokenBs,
        handleTokenAChange, handleTokenBChange,
        amount, setAmount,
        timeRange, setTimeRange,
        customRange, setCustomRange,
        slippage, setSlippage,
        compoundYield, setCompoundYield,
        xcmFees, setXcmFees,
        chartMetric, setChartMetric,
        hoveredPoint, setHoveredPoint,
        isSimulating, isSuggesting,
        simulationSteps, currentStepIndex,
        showSuccessPulse, isLoadingInitial,
        simulationResult, suggestedStrategies,
        toastState, setToastState,
        selectedStrategyForModal, setSelectedStrategyForModal,
        fetchedTokens, fetchedParachains, fetchedProtocols,
        poolTypeDetails, strategyTypeDetails,
        dateRange,
        handleRunSimulation, handleSuggestStrategies, handleSelectStrategy,
    };
}
