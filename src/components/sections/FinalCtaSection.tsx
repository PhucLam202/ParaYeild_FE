"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

export default function FinalCtaSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-background">
            {/* Dark background with green ambient glow */}
            <div className="ambient-glow absolute w-[600px] h-[600px] bg-[#00FFA3]/8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="ambient-glow absolute w-[300px] h-[300px] bg-[#552BBF]/12 left-[20%] bottom-0" />

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />

            {/* Top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFA3]/30 to-transparent" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/5 mb-8"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                    <span className="text-xs font-mono text-[#00FFA3] uppercase tracking-widest">Ready to optimize?</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-sans font-bold mb-6 text-white leading-tight tracking-tight"
                >
                    Start Backtesting
                    <br />
                    <span className="text-gradient">Your Strategy Today</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Join traders analyzing over $450M in liquidity across the Polkadot ecosystem. No wallet required to simulate.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/simulator"
                        className="px-8 py-4 bg-[#00FFA3] text-[#020402] rounded-lg font-mono font-bold uppercase tracking-widest text-sm flex items-center gap-2 group hover:bg-[#00CC82] hover:shadow-[0_0_40px_rgba(0,255,163,0.35)] hover:scale-105 transition-all duration-300"
                    >
                        Launch Simulator
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#"
                        className="px-8 py-4 border border-white/10 text-gray-300 rounded-lg font-mono font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                        <FileText className="w-4 h-4" />
                        View Documentation
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
