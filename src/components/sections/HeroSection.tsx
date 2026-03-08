"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2 } from "lucide-react";
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
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold mb-8 leading-[1.05] tracking-tighter text-white px-4 md:px-0">
                            Understand your yield<br className="hidden md:block" />
                            before you <span className="text-gradient">deposit.</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-sans max-w-2xl mx-auto mb-10 leading-relaxed opacity-80">
                            Simulate liquidity strategies across Polkadot parachains using 18 months of real on-chain data. No wallet required.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="flex items-center justify-center mb-12"
                    >
                        <p className="text-gray-500 text-sm font-mono tracking-wide">
                            · Polkadot Native &nbsp; · Non-Custodial &nbsp; · Open Source
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto"
                    >
                        <Link href="/simulator" passHref>
                            <Button className="px-8 py-6 bg-[#00FFA3] text-[#020402] hover:bg-[#00CC82] rounded-md hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-all duration-300 flex items-center gap-2 group font-mono font-bold uppercase tracking-widest">
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
