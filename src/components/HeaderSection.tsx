"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Settings } from "lucide-react";

// Token display configuration
const TOKEN_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
    DOT: { label: 'Polkadot', icon: <img src="/polkadot-new-dot-logo.svg" alt="Polkadot" className="w-4 h-4" /> },
    KSM: { label: 'Kusama', icon: <img src="/kusama-ksm-logo.svg" alt="Kusama" className="w-4 h-4 rounded-full" /> },
    ASTR: { label: 'Astar', icon: <img src="/astar-astr-logo.svg" alt="Astar" className="w-4 h-4 rounded-full" /> },
    GLMR: { label: 'Moonbeam', icon: <img src="/moonbeam-glmr-logo.svg" alt="Moonbeam" className="w-4 h-4 rounded-full" /> },
    BNC: { label: 'Bifrost', icon: <img src="/biforst.svg" alt="Bifrost" className="w-4 h-4 rounded-full" /> }
};

const AVAILABLE_TOKENS = Object.keys(TOKEN_CONFIG);

export default function HeaderSection() {
    const [scrolled, setScrolled] = useState(false);
    const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
    const [selectedTokens, setSelectedTokens] = useState<string[]>(['DOT', 'KSM', 'ASTR']);
    const [showSelector, setShowSelector] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Load selected tokens from localStorage on mount
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

    // Handle scroll background changes
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close selector when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setShowSelector(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch token prices
    useEffect(() => {
        if (pathname === '/simulator') {
            const fetchPrices = async () => {
                if (selectedTokens.length === 0) return;
                try {
                    const symbols = selectedTokens.join(',');
                    const res = await fetch(`http://localhost:3005/api/v1/price-indexer/tokens/realtime?symbols=${symbols}`);
                    if (res.ok) {
                        const data = await res.json();
                        const newPrices: Record<string, number> = {};
                        if (data && data.tokens && Array.isArray(data.tokens)) {
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
            // Fetch every 1 minute (60000ms)
            const interval = setInterval(fetchPrices, 60000);
            return () => clearInterval(interval);
        }
    }, [pathname, selectedTokens]);

    const toggleToken = (token: string) => {
        let newSelected;
        if (selectedTokens.includes(token)) {
            newSelected = selectedTokens.filter(t => t !== token);
        } else {
            newSelected = [...selectedTokens, token];
        }

        // Ensure at least one token is selected
        if (newSelected.length === 0) newSelected = [token];

        setSelectedTokens(newSelected);
        localStorage.setItem('selectedTokens', JSON.stringify(newSelected));
    };

    const tokensToRender = selectedTokens.filter(sym => typeof tokenPrices[sym] === 'number' && TOKEN_CONFIG[sym]);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-dark/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-heading font-bold text-white tracking-tighter">
                        ParaYield<span className="text-brand-pink">_Lab</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link href="/#features" className="hover:text-brand-pink transition-colors">Features</Link>
                        <Link href="/#ecosystem" className="hover:text-brand-pink transition-colors">Ecosystem</Link>
                        <Link href="/#how-it-works" className="hover:text-brand-pink transition-colors">How it Works</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Simulator Page Token Prices Dashboard */}
                    {pathname === '/simulator' && (
                        <div className="relative" ref={selectorRef}>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-4 pr-2 py-1.5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    {tokensToRender.map((tokenSymbol, index) => {
                                        const config = TOKEN_CONFIG[tokenSymbol];
                                        const price = tokenPrices[tokenSymbol];

                                        return (
                                            <div key={tokenSymbol} className="flex items-center gap-2">
                                                {index > 0 && <div className="w-[1px] h-4 bg-white/20"></div>}
                                                <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-default group" title={config.label}>
                                                    {config.icon}
                                                    <span className="text-white font-semibold text-[13px] tracking-wide">
                                                        ${price?.toFixed(3) || '0.000'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {tokensToRender.length === 0 && selectedTokens.length > 0 && (
                                        <span className="text-white/50 text-xs px-2 py-1 cursor-default animate-pulse">Loading prices...</span>
                                    )}
                                </div>

                                <div className="w-[1px] h-5 bg-white/10 ml-1"></div>

                                {/* Settings button to open token selector */}
                                <button
                                    onClick={() => setShowSelector(!showSelector)}
                                    className={`p-1.5 rounded-full transition-colors focus:outline-none ${showSelector ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                                    title="Display Settings"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Dropdown Selector */}
                            {showSelector && (
                                <div className="absolute top-full right-0 mt-3 w-48 bg-[#1a1c23] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3 py-2 border-b border-white/5 bg-white/5">
                                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Show Prices</p>
                                    </div>
                                    <div className="p-2 flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                                        {AVAILABLE_TOKENS.map(tokenSymbol => {
                                            const config = TOKEN_CONFIG[tokenSymbol];
                                            const isSelected = selectedTokens.includes(tokenSymbol);
                                            return (
                                                <label
                                                    key={tokenSymbol}
                                                    className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {config.icon}
                                                        <span className="text-sm text-gray-200">{tokenSymbol}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-pink border-brand-pink' : 'border-white/30'}`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => toggleToken(tokenSymbol)}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {pathname !== '/simulator' && (
                        <Link href="/simulator" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2 group">
                            Launch App
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
