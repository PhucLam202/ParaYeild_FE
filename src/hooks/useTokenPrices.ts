"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_SELECTED = ['DOT', 'KSM', 'ASTR'];

export function useTokenPrices(availableTokens: string[]) {
    const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
    const [selectedTokens, setSelectedTokens] = useState<string[]>(DEFAULT_SELECTED);
    const [showSelector, setShowSelector] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const saved = localStorage.getItem('selectedTokens');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSelectedTokens(parsed);
                }
            } catch (e) {
                console.error("Failed to parse selected tokens", e);
            }
        }
    }, []);

    useEffect(() => {
        if (pathname !== '/simulator') return;

        const fetchPrices = async () => {
            if (selectedTokens.length === 0) return;
            try {
                const symbols = selectedTokens.join(',');
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005/api/v1";
                const res = await fetch(`${baseUrl}/price-indexer/tokens/realtime?symbols=${symbols}`);
                if (res.ok) {
                    const data = await res.json();
                    const newPrices: Record<string, number> = {};
                    if (data?.tokens && Array.isArray(data.tokens)) {
                        data.tokens.forEach((item: any) => {
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
    }, [pathname, selectedTokens]);

    const toggleToken = (token: string) => {
        let newSelected = selectedTokens.includes(token)
            ? selectedTokens.filter(t => t !== token)
            : [...selectedTokens, token];
        if (newSelected.length === 0) newSelected = [token];
        setSelectedTokens(newSelected);
        localStorage.setItem('selectedTokens', JSON.stringify(newSelected));
    };

    return { tokenPrices, selectedTokens, showSelector, setShowSelector, toggleToken };
}
