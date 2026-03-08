export type {
    SimulationAllocation,
    SimulationRequest,
    SimulationSummary,
    YieldFarmingStats,
    SimulationBreakdownItem,
    TimeSeriesPoint,
    SimulationResponse,
    LpFarmPool,
    PoolItem,
    StrategyAllocation,
    SuggestedStrategy,
    SuggestStrategiesResponse,
    BacktestMetadataMappingItem,
    BacktestMetadataResponse,
} from "@/types/simulator";

import type {
    LpFarmPool,
    BacktestMetadataResponse,
    SimulationRequest,
    SimulationResponse,
    PoolItem,
    SuggestStrategiesResponse,
} from "@/types/simulator";

interface LpFarmsResponse {
    count: number;
    data: LpFarmPool[];
}

export function getEffectiveApy(pool: LpFarmPool): number {
    if (pool.totalApy != null) return pool.totalApy;
    return (pool.supplyApy ?? 0) + (pool.rewardApy ?? 0);
}

const API_BASE_URL = typeof window !== "undefined"
    ? "/api/proxy"
    : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005/api/v1");

export const simulatorService = {
    async getBacktestMetadata(): Promise<BacktestMetadataResponse> {
        const response = await fetch(`${API_BASE_URL}/backtest/metadata`);
        if (!response.ok) throw new Error("Failed to fetch backtest metadata");
        return response.json();
    },

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
        const url = protocol ? `${API_BASE_URL}/simulation/tokens?protocol=${protocol}` : `${API_BASE_URL}/simulation/tokens`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch tokens");
        const json = await response.json();
        const data = Array.isArray(json) ? json : json.data ?? [];
        return data.map((t: any) => ({ symbol: t.symbol || t }));
    },

    async getParachains() {
        const response = await fetch(`${API_BASE_URL}/simulation/parachains`);
        if (!response.ok) throw new Error("Failed to fetch parachains");
        const json = await response.json();
        const data = Array.isArray(json) ? json : json.data ?? [];
        return data.map((p: any) => ({ id: p.id || p, name: p.name || p.id || p }));
    },

    async getLpFarms(params?: {
        protocol?: string;
        network?: string;
        asset?: string;
        minApy?: number;
        limit?: number;
    }): Promise<LpFarmsResponse> {
        const qs = new URLSearchParams();
        if (params?.protocol) qs.append("protocol", params.protocol);
        if (params?.network) qs.append("network", params.network);
        if (params?.asset) qs.append("asset", params.asset);
        if (params?.minApy !== undefined) qs.append("minApy", params.minApy.toString());
        if (params?.limit !== undefined) qs.append("limit", params.limit.toString());
        const url = `${API_BASE_URL}/pools/lp-farms${qs.toString() ? `?${qs}` : ""}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch LP farms");
        return response.json();
    },

    async getProtocolTypes(protocol?: string) {
        const url = protocol ? `${API_BASE_URL}/simulation/protocol-types?protocol=${protocol}` : `${API_BASE_URL}/simulation/protocol-types`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch protocol types");
        const json = await response.json();
        const data = Array.isArray(json) ? json : json.data ?? [];
        return data.map((t: any) => ({ id: t.id || t, label: t.label || t.id || t }));
    },
};

// Helper to handle fetch with better error reporting
async function urlFetch(url: string, init?: RequestInit) {
    return fetch(url, init);
}
