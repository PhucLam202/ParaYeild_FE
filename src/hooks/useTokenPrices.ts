"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_SELECTED = ['DOT', 'KSM', 'ASTR'];

export function useTokenPrices(_availableTokens: string[]) {
    const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
    const [selectedTokens, setSelectedTokens] = useState<string[]>(DEFAULT_SELECTED);
    const [showSelector, setShowSelector] = useState(false);
    const [precision, setPrecision] = useState(2);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const saved = localStorage.getItem('selectedTokens');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSelectedTokens(parsed);
                }
            } catch (e) { console.error(e); }
        }
        
        const savedPrecision = localStorage.getItem('pricePrecision');
        if (savedPrecision) setPrecision(parseInt(savedPrecision));
        
        const savedAuto = localStorage.getItem('autoRefresh');
        if (savedAuto) setAutoRefresh(savedAuto === 'true');
    }, []);

    useEffect(() => {
        if (pathname !== '/simulator' || !autoRefresh) return;

        const fetchPrices = async () => {
            if (selectedTokens.length === 0) return;
            try {
                const symbols = selectedTokens.join(',');
                const baseUrl = "/api/proxy";
                const res = await fetch(`${baseUrl}/price-indexer/tokens/realtime?symbols=${symbols}`);
                if (res.ok) {
                    const data = await res.json();
                    const newPrices: Record<string, number> = {};
                    if (data?.tokens && Array.isArray(data.tokens)) {
                        data.tokens.forEach((item: { symbol: string; price: number }) => {
                            const sym = item.symbol.split('/')[0];
                            newPrices[sym] = item.price;
                        });
                    }
                    setTokenPrices(newPrices);
                }
            } catch (error) {
                console.error("Failed to fetch token prices:", error);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, [pathname, selectedTokens, autoRefresh]);

    const toggleToken = (token: string) => {
        let newSelected = selectedTokens.includes(token)
            ? selectedTokens.filter(t => t !== token)
            : [...selectedTokens, token];
        if (newSelected.length === 0) newSelected = [token];
        setSelectedTokens(newSelected);
        localStorage.setItem('selectedTokens', JSON.stringify(newSelected));
    };

    const updatePrecision = (p: number) => {
        setPrecision(p);
        localStorage.setItem('pricePrecision', p.toString());
    };

    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
        localStorage.setItem('autoRefresh', (!autoRefresh).toString());
    };

    return { 
        tokenPrices, 
        selectedTokens, 
        showSelector, 
        setShowSelector, 
        toggleToken,
        precision,
        updatePrecision,
        autoRefresh,
        toggleAutoRefresh
    };
}
