"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Lock, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
                <div className="max-w-6xl mx-auto text-center">
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

                                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold mb-8 leading-[1.05] tracking-tighter text-white px-4 md:px-0">
                            Optimize Your DeFi Yield<br className="hidden md:block" />
                            With Polkadot's <span className="text-gradient">Precise Engine</span>
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
                        className="flex flex-wrap items-center justify-center gap-3 mb-12"
                    >
                        {[
                            { icon: Shield, label: "Polkadot Native" },
                            { icon: Lock, label: "Non-Custodial" },
                            { icon: Code2, label: "Open Source" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-gray-300 text-sm font-mono tracking-wide">
                                <Icon className="w-3.5 h-3.5 text-[#00FFA3]" />
                                {label}
                            </div>
                        ))}
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
