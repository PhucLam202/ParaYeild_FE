"use client";

import { motion } from "framer-motion";
import { TrendingUp, Scale, Network, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoreFeaturesSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Decorative background grid and glow */}
            <div className="absolute inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#00FFA3]/3 blur-[120px] rounded-full mix-blend-screen transform -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white"
                    >
                        Backtest before you <span className="text-gradient">risk capital.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg font-sans"
                    >
                        Three tools to understand returns, IL, and routing — before entering a position.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Item 1: Historical Backtester (Spans 2 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{ y: -4, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                        className="md:col-span-2 group flex"
                    >
                        <Card className="w-full h-full bg-[#0A0C14]/40 border-white/10 backdrop-blur-md rounded-none hover:border-[#00FFA3]/30 transition-all duration-500 overflow-hidden relative flex flex-col justify-between min-h-[300px]">
                            {/* Top gradient accent line */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00FFA3] to-[#00CC82] opacity-60 group-hover:opacity-100 transition-opacity" />
                            {/* Technical Corner Accent */}
                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00FFA3]" />
                            </div>

                            <CardHeader className="relative z-10 pb-2">
                                <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-[#00FFA3]/30">
                                    <TrendingUp className="w-6 h-6 text-[#00FFA3]" />
                                </div>
                                <CardTitle className="text-2xl font-bold font-sans text-white group-hover:text-[#00FFA3] transition-colors tracking-tight">Historical Backtester</CardTitle>
                                <CardDescription className="text-gray-400 font-sans text-base mt-2 opacity-80">
                                    Test your cross-chain strategies against precise historical data from native parachain APIs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 flex-grow pt-4 flex items-end">
                                {/* Abstract API Graph visual */}
                                <div className="w-full h-24 flex items-end justify-between gap-2 opacity-30 group-hover:opacity-80 transition-opacity duration-500">
                                    {[20, 45, 30, 60, 40, 75, 50, 90, 65, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-[#00FFA3]/10 to-[#00FFA3]/60 rounded-none" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Item 2: IL Simulator */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ y: -4, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                        className="md:col-span-1 group flex"
                    >
                        <Card className="w-full h-full bg-[#0A0C14]/40 border-white/10 backdrop-blur-md rounded-none hover:border-[#A78BFA]/30 transition-all duration-500 relative flex flex-col justify-between overflow-hidden min-h-[300px]">
                            {/* Top gradient accent line */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#552BBF] opacity-60 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00FFA3]" />
                            </div>
                            <CardHeader className="relative z-10">
                                <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-[#00FFA3]/30">
                                    <Scale className="w-6 h-6 text-[#00FFA3]" />
                                </div>
                                <CardTitle className="text-2xl font-bold font-sans text-white group-hover:text-[#00FFA3] transition-colors tracking-tight">IL Simulator</CardTitle>
                                <CardDescription className="text-gray-400 font-sans text-base mt-2 opacity-80">
                                    Calculate and visualize potential Impermanent Loss.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 flex-grow pt-4">
                                <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-60 transition-opacity">
                                    <Activity className="w-20 h-20 text-[#00FFA3]" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Item 3: XCM Fee Optimizer (Spans 3 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ y: -4, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                        className="md:col-span-3 group flex"
                    >
                        <Card className="w-full h-full bg-[#0A0C14]/40 border-white/10 backdrop-blur-md rounded-none hover:border-[#60A5FA]/30 transition-all duration-500 overflow-hidden relative flex flex-col md:flex-row items-center min-h-[220px]">
                            {/* Top gradient accent line */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] opacity-60 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-10 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00FFA3]" />
                            </div>

                            <div className="md:w-1/2 flex flex-col justify-center h-full">
                                <CardHeader className="relative z-10">
                                    <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-[#00FFA3]/30">
                                        <Network className="w-6 h-6 text-[#00FFA3]" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold font-sans text-white group-hover:text-[#00FFA3] transition-colors tracking-tight">XCM Fee Optimizer</CardTitle>
                                    <CardDescription className="text-gray-400 font-sans text-base mt-2 max-w-md opacity-80">
                                        Analyze cross-chain message fees to find the most efficient transfer routes between parachains.
                                    </CardDescription>
                                </CardHeader>
                            </div>

                            <CardContent className="md:w-1/2 h-full relative z-10 flex items-center justify-center p-6 w-full">
                                {/* Visual network representation */}
                                <div className="w-full max-w-sm h-32 relative border border-white/10 rounded-none bg-black/50 p-4 flex items-center justify-between overflow-hidden group-hover:border-[#00FFA3]/30 transition-colors">
                                    <div className="w-12 h-12 rounded-none border border-[#00FFA3]/50 flex items-center justify-center bg-[#00FFA3]/10 z-10">
                                        <div className="w-2 h-2 bg-[#00FFA3] rounded-none animate-pulse shadow-[0_0_10px_#00FFA3]" />
                                    </div>
                                    <div className="flex-grow h-px bg-gradient-to-r from-[#00FFA3]/50 via-transparent to-white/20 relative mx-2">
                                        <div className="absolute top-1/2 left-0 w-4 h-4 -translate-y-1/2 -translate-x-1/2 bg-[#00FFA3] blur-[8px] rounded-none group-hover:animate-[ping_2s_infinite]" />
                                    </div>
                                    <div className="w-12 h-12 rounded-none border border-white/20 flex items-center justify-center bg-white/5 z-10">
                                        <div className="w-2 h-2 bg-white/50 rounded-none" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
