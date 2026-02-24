"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/CountUp";
import HeroBgAnimation from "./HeroBgAnimation";

/** -----------------------------------------------------------------------
 * HeroSection
 * ----------------------------------------------------------------------- */
export default function HeroSection() {
    return (
        <section
            className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden"
            style={{ background: "#060810" }}
        >
            {/* Animated Background Sequence */}
            <HeroBgAnimation />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 z-10 bg-[url('/grid-pattern.svg')] pointer-events-none opacity-[0.03]" />

            {/* Hero text content */}
            <div className="container mx-auto px-6 relative z-20 pointer-events-none">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex justify-center mb-8">
                            <Badge variant="outline" className="border-[#00FFA3]/50 text-[#00FFA3] bg-[#00FFA3]/10 px-4 py-1.5 backdrop-blur-md rounded-none font-mono text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3] animate-pulse" />
                                Network Status: Online
                            </Badge>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-sans font-bold mb-8 leading-[1.1] tracking-tighter text-white px-4 md:px-0">
                            Optimize Your DeFi Yield <br className="hidden md:block" />
                            With Polkadot’s <span className="text-gradient">Precise Engine</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-sans max-w-2xl mx-auto mb-10 leading-relaxed opacity-80">
                            Stop guessing your DeFi returns. Use real-time parachain data to simulate entry/exit points,
                            calculate IL, and find the most profitable routes across the Polkadot ecosystem.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12 text-gray-400 font-mono text-sm md:text-base bg-[#0A0C14]/80 border border-white/10 py-8 px-12 rounded-none backdrop-blur-md mx-auto w-fit relative">
                            {/* Technical Corner Accents */}
                            <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#00FFA3]" />
                            <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#00FFA3]" />

                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white mb-1"><CountUp from={0} to={450} duration={2} prefix="$" suffix="M+" /></span>
                                <span className="uppercase tracking-[0.2em] text-[#00FFA3]/70 text-[10px] text-center font-bold">Liquid Indexed</span>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white mb-1"><CountUp from={0} to={120} duration={2.5} suffix="+" /></span>
                                <span className="uppercase tracking-[0.2em] text-[#00FFA3]/70 text-[10px] text-center font-bold">Live Pools<br />(Acala, Hydration, Bifrost)</span>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white mb-1">24/7</span>
                                <span className="uppercase tracking-[0.2em] text-[#00FFA3]/70 text-[10px] text-center font-bold">Real-time Sync</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto"
                    >
                        <Link href="/simulator" passHref>
                            <Button className="px-8 py-6 bg-[#00FFA3] text-[#020402] hover:bg-[#00CC82] rounded-md hover:scale-105 transition-all duration-300 flex items-center gap-2 group font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,163,0.3)]">
                                Launch Simulator
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="outline" className="px-8 py-6 border-[#00FFA3]/30 text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:text-[#00FFA3] rounded-md transition-all duration-300 flex items-center gap-2 font-mono uppercase tracking-widest backdrop-blur-md">
                            <BarChart2 className="w-5 h-5" />
                            Explore Data
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
