"use client";

import { useState, useEffect, useMemo } from "react";
import { simulatorService, getEffectiveApy } from "@/services/simulatorService";
import type { LpFarmPool } from "@/types/simulator";

export type TvlRange = "all" | "0-1M" | "1M-10M" | "10M-100M" | "100M+";
export type ApyRange = "all" | "0-5" | "5-15" | "15-30" | "30+";

const ITEMS_PER_PAGE = 5;
const PAGINATION_THRESHOLD = 10;

export interface PoolsExplorerState {
    pools: LpFarmPool[];
    filteredPools: LpFarmPool[];
    visiblePools: LpFarmPool[];
    isLoading: boolean;
    error: string | null;
    chain: string;
    setChain: (v: string) => void;
    category: string;
    setCategory: (v: string) => void;
    tvlRange: TvlRange;
    setTvlRange: (v: TvlRange) => void;
    apyRange: ApyRange;
    setApyRange: (v: ApyRange) => void;
    isExpanded: boolean;
    setIsExpanded: (v: boolean) => void;
    availableChains: string[];
    availableCategories: string[];
    clearFilters: () => void;
    hasActiveFilters: boolean;
    remainingCount: number;
    // Pagination
    currentPage: number;
    setCurrentPage: (v: number) => void;
    totalPages: number;
    usePagination: boolean;
}

function computeRiskScore(pool: LpFarmPool): number {
    if (pool.riskScore != null) return pool.riskScore;
    let score = 5;
    const apy = getEffectiveApy(pool);
    if (apy > 50) score += 2;
    else if (apy > 20) score += 1;
    if ((pool.tvlUsd ?? 0) < 500_000) score += 1;
    if ((pool.tvlUsd ?? 0) > 10_000_000) score -= 1;
    return Math.max(1, Math.min(10, score));
}

export function usePoolsExplorer(): PoolsExplorerState {
    const [pools, setPools] = useState<LpFarmPool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chain, setChain] = useState("all");
    const [category, setCategory] = useState("all");
    const [tvlRange, setTvlRange] = useState<TvlRange>("all");
    const [apyRange, setApyRange] = useState<ApyRange>("all");
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPools = async () => {
            try {
                setIsLoading(true);
                const data = await simulatorService.getAllPoolsDetailed();
                const enriched = data.map(p => ({
                    ...p,
                    riskScore: p.riskScore ?? computeRiskScore(p),
                }));
                setPools(enriched);
            } catch (err) {
                setError("Failed to load pools. Please try again later.");
                console.error("Failed to fetch pools:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPools();
    }, []);

    const availableChains = useMemo(() => {
        const chains = new Set(pools.map(p => p.network));
        return Array.from(chains).sort();
    }, [pools]);

    const availableCategories = useMemo(() => {
        const categories = new Set(pools.map(p => p.poolType));
        return Array.from(categories).sort();
    }, [pools]);

    const hasActiveFilters = chain !== "all" || category !== "all" || tvlRange !== "all" || apyRange !== "all";

    const filteredPools = useMemo(() => {
        return pools.filter(pool => {
            if (chain !== "all" && pool.network !== chain) return false;
            if (category !== "all" && pool.poolType !== category) return false;

            const tvl = pool.tvlUsd ?? 0;
            switch (tvlRange) {
                case "0-1M": if (tvl >= 1_000_000) return false; break;
                case "1M-10M": if (tvl < 1_000_000 || tvl >= 10_000_000) return false; break;
                case "10M-100M": if (tvl < 10_000_000 || tvl >= 100_000_000) return false; break;
                case "100M+": if (tvl < 100_000_000) return false; break;
            }

            const apy = getEffectiveApy(pool);
            switch (apyRange) {
                case "0-5": if (apy >= 5) return false; break;
                case "5-15": if (apy < 5 || apy >= 15) return false; break;
                case "15-30": if (apy < 15 || apy >= 30) return false; break;
                case "30+": if (apy < 30) return false; break;
            }

            return true;
        });
    }, [pools, chain, category, tvlRange, apyRange]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
        setIsExpanded(false);
    }, [chain, category, tvlRange, apyRange]);

    const usePagination = filteredPools.length > PAGINATION_THRESHOLD;
    const totalPages = Math.ceil(filteredPools.length / ITEMS_PER_PAGE);

    const visiblePools = useMemo(() => {
        if (usePagination) {
            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            return filteredPools.slice(start, start + ITEMS_PER_PAGE);
        }
        // Non-paginated: show first 5, expand to show all
        return isExpanded ? filteredPools : filteredPools.slice(0, ITEMS_PER_PAGE);
    }, [filteredPools, isExpanded, usePagination, currentPage]);

    const remainingCount = filteredPools.length - ITEMS_PER_PAGE;

    const clearFilters = () => {
        setChain("all");
        setCategory("all");
        setTvlRange("all");
        setApyRange("all");
    };

    return {
        pools,
        filteredPools,
        visiblePools,
        isLoading,
        error,
        chain, setChain,
        category, setCategory,
        tvlRange, setTvlRange,
        apyRange, setApyRange,
        isExpanded, setIsExpanded,
        availableChains,
        availableCategories,
        clearFilters,
        hasActiveFilters,
        remainingCount,
        currentPage, setCurrentPage,
        totalPages,
        usePagination,
    };
}
