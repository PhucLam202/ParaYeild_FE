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
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-sans font-bold mb-6 text-white leading-tight tracking-tight"
                >
                    See your numbers
                    <br />
                    <span className="text-gradient">before you commit capital.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
                >
                    No wallet required. Run a simulation in under 30 seconds.
                </motion.p>

                {/* Mini product mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-sm mx-auto mb-12 border border-white/10 rounded-xl bg-white/[0.03] p-4 font-mono text-xs text-left"
                >
                    <div className="flex justify-between text-gray-500 mb-3">
                        <span>Pool: DOT / USDC</span>
                        <span className="text-[#00FFA3]">● Live</span>
                    </div>
                    <div className="flex justify-between text-gray-300 mb-1">
                        <span>Deposit</span><span>10,000 USDC</span>
                    </div>
                    <div className="flex justify-between text-gray-300 mb-3">
                        <span>Range</span><span>−15% / +20%</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between">
                        <span className="text-gray-500">Est. APY</span>
                        <span className="text-[#00FFA3] font-bold">28.4%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">IL Risk</span>
                        <span className="text-orange-400">−6.3%</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
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
