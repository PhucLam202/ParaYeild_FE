export interface SimulationAllocation {
    protocol: string;
    assetSymbol: string;
    percentage: number;
    poolType?: string;
}

export interface SimulationRequest {
    initialAmountUsd: number;
    from: string;
    to: string;
    allocations: SimulationAllocation[];
    includeIL?: boolean;
    rebalanceIntervalDays?: number;
    xcmFeeUsd?: number;
    isCompound?: boolean;
    compoundFrequencyDays?: number;
    compoundFeeUsd?: number;
    slippageTolerancePercent?: number;
}

export interface SimulationSummary {
    initialAmountUsd: number;
    finalAmountUsd: number;
    totalReturnUsd: number;
    totalReturnPercent: number;
    annualizedApyPercent: number;
    maxDrawdownPercent: number;
    sharpeRatio: number;
    durationDays: number;
    xcmFeesPaidUsd: number;
    ilIncluded: boolean;
    totalHarvestEventsCount?: number;
    slippageCostUsd?: number;
    rebalancedCount?: number;
    isCompound?: boolean;
    compoundFrequencyDays?: number | null;
    compoundFeeUsd?: number;
    riskScore?: number;
    riskLevel?: string;
    slippageTolerancePercent?: number;
}

export interface YieldFarmingStats {
    totalFarmingRewardsEarnedUsd: number;
    totalCompoundedRewardsUsd: number;
    remainingUnclaimedRewardsUsd: number;
    harvestFeesPaidUsd: number;
    harvestEventsCount: number;
}

export interface SimulationBreakdownItem {
    protocol: string;
    assetSymbol: string;
    poolType: string;
    allocationPercent: number;
    allocatedUsd: number;
    avgApyPercent: number;
    minApyPercent?: number;
    maxApyPercent?: number;
    dataPointsUsed?: number;
    hasHistoricalData?: boolean;
    warning?: string;
    isFallbackData?: boolean;
    dataSource?: string;
    avgSupplyApyPercent?: number;
    avgRewardApyPercent?: number;
    avgTotalApyPercent?: number;
    minSupplyApyPercent?: number;
    maxSupplyApyPercent?: number;
    yieldFarmingStats?: YieldFarmingStats;
    accruedRewardsUsd?: number;
    ilLossUsd: number;
    finalUsd: number;
    returnUsd: number;
    returnPercent: number;
}

export interface TimeSeriesPoint {
    date: string;
    totalValueUsd: number;
    dailyReturnPct: number;
    unclaimedRewardsUsd?: number;
}

export interface SimulationResponse {
    summary: SimulationSummary;
    breakdown: SimulationBreakdownItem[];
    timeSeries: TimeSeriesPoint[];
}

export type ChartMetricType = "value" | "profit" | "return" | "yield" | "rewards";


export interface LpFarmPool {
    protocol: string;
    network: string;
    poolType: string;
    assetSymbol: string;
    totalApy: number | null;
    supplyApy: number | null;
    rewardApy: number | null;
    tvlUsd: number | null;
    metadata: Record<string, unknown>;
    dataTimestamp: string;
    crawledAt: string;
    apy30dAvg?: number | null;
    apyTrend?: 'up' | 'down' | 'flat' | 'stable';
    riskScore?: number | null;
    riskLabel?: 'low' | 'medium' | 'high';
    protocolLogo?: string;
    tokenIcon?: string;
    borrowApy?: number | null;
    utilizationRate?: number | null;
    volume24hUsd?: number | null;
    snapshotDate?: string;
    updatedAt?: string;
}

export interface PoolItem {
    protocol: string;
    assetSymbol: string;
    poolType: string;
    currentApy?: number;
}

export interface StrategyAllocation {
    protocol: string;
    assetSymbol: string;
    percentage: number;
    poolType: string;
    apyMin: number;
    apyMax: number;
    network?: string;
    tvlUsd?: number;
    currentApy?: number;
    supplyApy?: number;
    dataTimestamp?: string;
}

export interface SuggestedStrategy {
    id: string;
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    estimatedApyMin: number;
    estimatedApyMax: number;
    allocations: StrategyAllocation[];
}

export interface SuggestStrategiesResponse {
    generatedAt: string;
    totalPools: number;
    chains: SuggestedStrategy[];
}

export interface BacktestMetadataMappingItem {
    symbol: string;
    poolTypes: string[];
}

export interface PoolTypeDetail {
    label: string;
    description: string;
    hasIL: boolean;
    riskLevel: string;
    expectedApyRange: { min: number; max: number };
}

export interface StrategyTypeDetail {
    label: string;
    risk: string;
    description: string;
    apyRange: { min: number; max: number };
}

export interface BacktestMetadataEnums {
    poolTypeDetails: Record<string, PoolTypeDetail>;
    strategyTypeDetails: Record<string, StrategyTypeDetail>;
}

export interface BacktestMetadataResponse {
    protocols: string[];
    mappings: Record<string, BacktestMetadataMappingItem[]>;
    enums?: BacktestMetadataEnums;
}
