"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTokenPrices } from "@/hooks/useTokenPrices";

const TOKEN_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
    DOT: { label: "Polkadot", icon: <img src="/polkadot-new-dot-logo.svg" alt="Polkadot" className="w-4 h-4" /> },
    KSM: { label: "Kusama", icon: <img src="/kusama-ksm-logo.svg" alt="Kusama" className="w-4 h-4 rounded-full" /> },
    ASTR: { label: "Astar", icon: <img src="/astar-astr-logo.svg" alt="Astar" className="w-4 h-4 rounded-full" /> },
    GLMR: { label: "Moonbeam", icon: <img src="/moonbeam-glmr-logo.svg" alt="Moonbeam" className="w-4 h-4 rounded-full" /> },
    BNC: { label: "Bifrost", icon: <img src="/biforst.svg" alt="Bifrost" className="w-4 h-4 rounded-full" /> },
};

const AVAILABLE_TOKENS = Object.keys(TOKEN_CONFIG);

const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Ecosystem", href: "/#ecosystem" },
    { label: "How it Works", href: "/#how-it-works" },
];

export default function HeaderSection() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { tokenPrices, selectedTokens, showSelector, setShowSelector, toggleToken } = useTokenPrices(AVAILABLE_TOKENS);

    const tokensToRender = selectedTokens.filter((sym) => typeof tokenPrices[sym] === "number" && TOKEN_CONFIG[sym]);
    const pricesLoaded = tokensToRender.length > 0;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
                setShowSelector(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-[#020402]/85 backdrop-blur-xl border-b border-white/8 py-3 shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
                    : "bg-transparent py-5"
            }`}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                {/* Logo + nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold text-white tracking-tight">
                        ParaYield<span className="text-[#00FFA3]">_Lab</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        {navLinks.map((l) => (
                            <Link key={l.href} href={l.href} className="hover:text-white transition-colors duration-200">
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Token price widget — only on simulator page */}
                    {pathname === "/simulator" && (
                        <AnimatePresence>
                            {(pricesLoaded || selectedTokens.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative"
                                    ref={selectorRef}
                                >
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full pl-3 pr-2 py-1.5">
                                        <div className="flex items-center gap-1">
                                            {tokensToRender.map((sym, i) => {
                                                const config = TOKEN_CONFIG[sym];
                                                const price = tokenPrices[sym];
                                                return (
                                                    <div key={sym} className="flex items-center gap-1">
                                                        {i > 0 && <div className="w-px h-4 bg-white/15" />}
                                                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/8 transition-colors cursor-default" title={config.label}>
                                                            {config.icon}
                                                            <span className="text-white font-semibold text-[12px] font-mono">
                                                                ${price?.toFixed(2) ?? "—"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {!pricesLoaded && selectedTokens.length > 0 && (
                                                <span className="text-white/40 text-xs px-2 animate-pulse">Loading…</span>
                                            )}
                                        </div>
                                        <div className="w-px h-4 bg-white/10" />
                                        <button
                                            onClick={() => setShowSelector(!showSelector)}
                                            className={`p-1.5 rounded-full transition-colors ${showSelector ? "bg-white/15 text-white" : "hover:bg-white/8 text-white/40 hover:text-white"}`}
                                            title="Display Settings"
                                        >
                                            <Settings className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showSelector && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full right-0 mt-2 w-48 bg-[#0E1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                            >
                                                <div className="px-3 py-2 border-b border-white/5 bg-white/3">
                                                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Show Prices</p>
                                                </div>
                                                <div className="p-2 flex flex-col gap-1">
                                                    {AVAILABLE_TOKENS.map((sym) => {
                                                        const config = TOKEN_CONFIG[sym];
                                                        const isSelected = selectedTokens.includes(sym);
                                                        return (
                                                            <label
                                                                key={sym}
                                                                className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-white/8" : "hover:bg-white/5"}`}
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    {config.icon}
                                                                    <span className="text-sm text-gray-200">{sym}</span>
                                                                </div>
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-[#00FFA3] border-[#00FFA3]" : "border-white/25"}`}>
                                                                    {isSelected && (
                                                                        <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleToken(sym)} />
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

                    {/* Launch App button (non-simulator pages) */}
                    {pathname !== "/simulator" && (
                        <Link
                            href="/simulator"
                            className="hidden md:flex px-5 py-2 bg-white/6 hover:bg-white/12 border border-white/15 rounded-full text-white font-semibold text-sm transition-all duration-200 items-center gap-2 group"
                        >
                            Launch App
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile slide-down drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden border-t border-white/8 bg-[#020402]/95 backdrop-blur-xl"
                    >
                        <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((l) => (
                                <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white text-base font-medium transition-colors py-1">
                                    {l.label}
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-white/8">
                                <Link
                                    href="/simulator"
                                    className="flex items-center gap-2 px-5 py-3 bg-[#00FFA3] text-[#020402] rounded-lg font-mono font-bold text-sm uppercase tracking-widest w-full justify-center"
                                >
                                    Launch App
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
