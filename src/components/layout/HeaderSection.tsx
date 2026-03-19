"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { TOKEN_CONFIG } from "@/constants/tokens";

const AVAILABLE_TOKENS = Object.keys(TOKEN_CONFIG).filter(s => ["DOT", "KSM", "ASTR", "GLMR", "BNC"].includes(s));

const navLinks = [
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "Governance", href: "#" },
    { label: "Docs", href: "#" },
    { label: "Staking", href: "#" },
];

export default function HeaderSection() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { 
        tokenPrices, selectedTokens, showSelector, setShowSelector, toggleToken,
        precision, updatePrecision, autoRefresh, toggleAutoRefresh 
    } = useTokenPrices(AVAILABLE_TOKENS);

    const tokensToRender = selectedTokens.filter((sym) => TOKEN_CONFIG[sym]);
    const pricesLoaded = tokensToRender.some((sym) => typeof tokenPrices[sym] === "number");

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
    }, [setShowSelector]);

    // Close mobile menu on route change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-white/80 backdrop-blur-xl shadow-clay-sm"
                : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between px-5 py-4 md:px-16 max-w-[1480px] mx-auto">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#020402] shadow-clay-sm overflow-hidden border border-white/5">
                        <Image src="/logo_clay_transparent.png" alt="ParaYield Logo" width={44} height={44} className="object-contain" priority />
                    </div>
                    <Link href="/" className="text-slate-900 text-xl md:text-2xl font-bold tracking-tight">
                        ParaYield Lab
                    </Link>
                </div>

                {pathname !== "/simulator" && (
                    <nav className="hidden md:flex items-center gap-8 bg-white/40 backdrop-blur-md px-6 py-2.5 rounded-full shadow-clay-sm">
                        {navLinks.map((l, i) => (
                            <Link key={i} href={l.href} className="text-slate-700 text-sm font-semibold hover:text-primary transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-4">
                    {/* Launch App Button */}
                    {pathname !== "/simulator" && (
                        <Link
                            href="/simulator"
                            className="clay-button hidden sm:flex min-w-[132px] cursor-pointer items-center justify-center rounded-full h-11 px-5 bg-primary text-white text-sm font-bold shadow-clay-primary hover:-translate-y-1 transition-transform"
                        >
                            <span>Launch App</span>
                        </Link>
                    )}

                    {/* Token Widget & Avatar Container */}
                    <div className="flex items-center gap-2">
                        {pathname === "/simulator" && (
                            <AnimatePresence>
                                {(pricesLoaded || selectedTokens.length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative hidden md:block"
                                        ref={selectorRef}
                                    >
                                        <div className="flex items-center gap-2 bg-white rounded-full pl-3 pr-2 py-1.5 shadow-clay-sm border border-white/50">
                                            <div className="flex items-center gap-1">
                                                {tokensToRender.map((sym, i) => {
                                                    const config = TOKEN_CONFIG[sym];
                                                    const price = tokenPrices[sym];
                                                    return (
                                                        <div key={sym} className="flex items-center gap-1">
                                                            {i > 0 && <div className="w-px h-4 bg-slate-200" />}
                                                            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-slate-50 transition-colors cursor-default" title={config.label}>
                                                                {config.icon}
                                                                <span className="text-slate-700 font-semibold text-[12px] font-sans">
                                                                    ${price?.toFixed(precision) ?? "—"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {!pricesLoaded && selectedTokens.length > 0 && (
                                                    <span className="text-slate-400 text-xs px-2 animate-pulse">Loading…</span>
                                                )}
                                            </div>
                                            <div className="w-px h-4 bg-slate-200" />
                                            <button
                                                onClick={() => setShowSelector(!showSelector)}
                                                className={`p-1.5 rounded-full transition-colors ${showSelector ? "bg-slate-100 text-primary" : "text-slate-400 hover:text-primary"}`}
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
                                                    className="absolute top-full right-0 mt-4 w-48 bg-white border border-slate-100 rounded-2xl shadow-clay-lg overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400">Show Prices</p>
                                                    </div>
                                                    <div className="p-2 flex flex-col gap-1">
                                                        {AVAILABLE_TOKENS.map((sym) => {
                                                            const config = TOKEN_CONFIG[sym];
                                                            const isSelected = selectedTokens.includes(sym);
                                                            return (
                                                                <label
                                                                    key={sym}
                                                                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${isSelected ? "bg-slate-50" : "hover:bg-slate-50"}`}
                                                                >
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className="scale-75 origin-left">{config.icon}</div>
                                                                        <span className="text-[13px] font-semibold text-slate-600">{sym}</span>
                                                                    </div>
                                                                    <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-slate-300"}`}>
                                                                        {isSelected && (
                                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleToken(sym)} />
                                                                </label>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="px-4 py-2 border-t border-b border-slate-100 bg-slate-50/30">
                                                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400">Settings</p>
                                                    </div>

                                                    <div className="p-2 flex flex-col gap-1">
                                                        {/* Auto Refresh */}
                                                        <div className="flex items-center justify-between px-3 py-1.5">
                                                            <span className="text-[12px] font-semibold text-slate-500">Auto Refresh</span>
                                                            <button
                                                                onClick={toggleAutoRefresh}
                                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoRefresh ? "bg-primary" : "bg-slate-200"}`}
                                                            >
                                                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${autoRefresh ? "translate-x-4.5" : "translate-x-1"}`} />
                                                            </button>
                                                        </div>

                                                        {/* Precision */}
                                                        <div className="flex items-center justify-between px-3 py-1.5">
                                                            <span className="text-[12px] font-semibold text-slate-500">Precision</span>
                                                            <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                                                {[2, 4].map((p) => (
                                                                    <button
                                                                        key={p}
                                                                        onClick={() => updatePrecision(p)}
                                                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${precision === p ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}
                                                                    >
                                                                        {p}d
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                    </div>

                    {/* Mobile hamburger */}
                    {pathname !== "/simulator" && (
                        <button
                            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-primary bg-white shadow-clay-sm transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile slide-down drawer */}
            <AnimatePresence>
                {mobileOpen && pathname !== "/simulator" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl shadow-clay-lg"
                    >
                        <nav className="px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((l, i) => (
                                <Link key={i} href={l.href} className="text-slate-600 hover:text-primary text-base font-semibold transition-colors py-2">
                                    {l.label}
                                </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-slate-100">
                                <Link
                                    href="/simulator"
                                    className="flex items-center gap-2 px-5 py-4 bg-primary text-white rounded-xl font-sans font-bold text-sm tracking-wide w-full justify-center shadow-clay-primary"
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
