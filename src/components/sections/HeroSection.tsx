"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/** -----------------------------------------------------------------------
 * HeroSection
 * ----------------------------------------------------------------------- */
export default function HeroSection() {
    const proofPoints = [
        "Historical pool data across Polkadot DeFi",
        "Yield, IL, and fee breakdown in one view",
        "Scenario testing before you move capital",
    ];

    return (
        <section className="relative pt-28 pb-20 md:pt-40 md:pb-24 overflow-hidden">
            <main className="flex-1 px-5 md:px-16 py-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-4">
                            <span className="bg-primary/10 text-primary-dark font-bold text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full w-fit shadow-clay-sm">
                                Polkadot DeFi Intelligence
                            </span>
                            <h1 className="text-slate-900 text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                                Stop guessing your yield. <span className="text-primary">Backtest it first.</span>
                            </h1>
                            <p className="text-slate-600 text-base md:text-lg font-medium max-w-[720px] leading-relaxed">
                                ParaYield Lab helps you compare pools, model impermanent loss, and evaluate real opportunities across Polkadot using historical on-chain data.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/simulator"
                                className="clay-button min-w-[160px] cursor-pointer h-12 px-7 bg-primary text-white text-base font-bold rounded-2xl shadow-clay-primary flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform"
                            >
                                <span>Run Your First Simulation</span>
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            {proofPoints.map((point) => (
                                <div
                                    key={point}
                                    className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-clay-sm backdrop-blur-sm"
                                >
                                    {point}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center"
                    >
                        {/* 3D Clay Coin Illustration Container */}
                        <div className="relative w-full aspect-square max-w-[440px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px]"></div>

                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="relative w-56 h-56 bg-white rounded-full shadow-clay-lg flex items-center justify-center transform rotate-12 border border-white"
                            >
                                <img src="/polkadot-new-dot-logo.svg" className="w-40 h-40 object-contain" alt="Polkadot" />

                                {/* Small orbiting elements */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="absolute inset-[-34px] rounded-full pointer-events-none"
                                >
                                    <div className="absolute top-0 right-8 w-20 h-20 bg-white rounded-3xl shadow-clay-md flex items-center justify-center transform -rotate-12 pointer-events-auto border border-white p-3">
                                        <img src="/hydration.svg" className="w-full h-full object-contain" alt="Hydration" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                                    className="absolute inset-[-48px] rounded-full pointer-events-none"
                                >
                                    <div className="absolute bottom-8 left-0 w-28 h-28 bg-white rounded-3xl shadow-clay-md flex items-center justify-center transform rotate-45 pointer-events-auto border border-white p-5">
                                        <img src="/biforst.svg" className="w-full h-full object-contain" alt="Bifrost" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </section>
    );
}
