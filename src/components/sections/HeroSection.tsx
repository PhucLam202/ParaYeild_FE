"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/** -----------------------------------------------------------------------
 * HeroSection
 * ----------------------------------------------------------------------- */
export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
            <main className="flex-1 px-6 md:px-20 py-10">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="flex flex-col gap-4">
                            <span className="bg-primary/10 text-primary-dark font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full w-fit shadow-clay-sm">
                                Polkadot Ecosystem
                            </span>
                            <h1 className="text-slate-900 text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                                Yield <span className="text-primary">Redefined</span> on Polkadot
                            </h1>
                            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-[800px] leading-relaxed">
                                Experience the next generation of DeFi with our tactile, secure, and high-yield liquidity protocols built on Substrate.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-5">
                            <Link
                                href="/simulator"
                                className="clay-button min-w-[180px] cursor-pointer h-14 px-8 bg-primary text-white text-lg font-bold rounded-2xl shadow-clay-primary flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform"
                            >
                                <span>Get Started</span>
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </Link>

                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center"
                    >
                        {/* 3D Clay Coin Illustration Container */}
                        <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px]"></div>

                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="relative w-64 h-64 bg-gradient-to-br from-primary-light to-primary-dark rounded-full shadow-clay-lg flex items-center justify-center transform rotate-12"
                            >
                                <span className="material-symbols-outlined text-[120px] text-white/90">currency_bitcoin</span>

                                {/* Small orbiting elements */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="absolute inset-[-40px] rounded-full pointer-events-none"
                                >
                                    <div className="absolute top-0 right-10 w-24 h-24 bg-white rounded-3xl shadow-clay-md flex items-center justify-center transform -rotate-12 pointer-events-auto">
                                        <span className="material-symbols-outlined text-4xl text-primary">token</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                                    className="absolute inset-[-60px] rounded-full pointer-events-none"
                                >
                                    <div className="absolute bottom-10 left-0 w-32 h-32 bg-slate-100 rounded-full shadow-clay-md flex items-center justify-center transform rotate-45 pointer-events-auto">
                                        <span className="material-symbols-outlined text-5xl text-primary-dark">show_chart</span>
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
