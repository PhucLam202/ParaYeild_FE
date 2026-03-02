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
    isCompound?: boolean;
    rebalanceIntervalDays?: number;
    slippageTolerancePercent?: number;
    xcmFeeUsd?: number;
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
    ilLossUsd: number;
    finalUsd: number;
    returnUsd: number;
    returnPercent: number;
}

export interface TimeSeriesPoint {
    date: string;
    totalValueUsd: number;
    dailyReturnPct: number;
}

export interface SimulationResponse {
    summary: SimulationSummary;
    breakdown: SimulationBreakdownItem[];
    timeSeries: TimeSeriesPoint[];
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

const API_BASE_URL = "http://localhost:3005/api/v1";

export const simulatorService = {
    async runSimulation(data: SimulationRequest): Promise<SimulationResponse> {
        const response = await fetch(`${API_BASE_URL}/backtest/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            let errorMessage = `Failed to run simulation: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                // If parsing fails, use fallback message
            }
            throw new Error(errorMessage);
        }

        return response.json();
    },

    async getPools(protocol?: string): Promise<PoolItem[]> {
        const url = protocol ? `${API_BASE_URL}/pools?protocol=${protocol}` : `${API_BASE_URL}/pools`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch pools");
        const json = await response.json();
        return Array.isArray(json) ? json : json.data ?? [];
    },

    async suggestStrategies(riskLevel?: string, minApy?: number, refresh?: boolean): Promise<SuggestStrategiesResponse> {
        const params = new URLSearchParams();
        if (riskLevel) params.append("riskLevel", riskLevel);
        if (minApy !== undefined) params.append("minApy", minApy.toString());
        if (refresh) params.append("refresh", "true");

        const qs = params.toString();
        const url = `${API_BASE_URL}/backtest/suggest-strategies${qs ? `?${qs}` : ""}`;

        const response = await urlFetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch suggested strategies: ${response.statusText}`);
        }

        return response.json();
    },

    async getTokens(protocol?: string) {
        const pools = await this.getPools(protocol);
        const symbols = Array.from(new Set(pools.map(p => p.assetSymbol)));
        return symbols.map(s => ({ symbol: s }));
    },

    async getParachains() {
        const pools = await this.getPools();
        const protocols = Array.from(new Set(pools.map(p => p.protocol)));
        return protocols.map(p => ({ id: p, name: p }));
    },

    async getProtocolTypes(protocol?: string) {
        const pools = await this.getPools(protocol);
        const types = Array.from(new Set(pools.map(p => p.poolType)));
        return types.map(t => ({ id: t, label: t }));
    },
};

// Helper to handle fetch with better error reporting
async function urlFetch(url: string, init?: RequestInit) {
    return fetch(url, init);
}
