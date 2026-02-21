"use client";

import { motion } from "framer-motion";
import { TrendingUp, Scale, Network, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoreFeaturesSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Decorative background grid and glow */}
            <div className="absolute inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#00FFA3]/5 blur-[120px] rounded-full mix-blend-screen transform -translate-y-1/2 -translate-x-1/2 pointer-events-none fade-in-out"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white"
                    >
                        Core <span className="text-gradient">Engine</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg font-sans"
                    >
                        Advanced DeFi simulation tools powered by real-time parachain data.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto auto-rows-[300px]">
                    {/* Item 1: Historical Backtester (Spans 2 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:col-span-2 group flex"
                    >
                        <Card className="w-full h-full bg-[#101810]/40 border-white/5 backdrop-blur-md hover:border-[#00FFA3]/50 transition-all duration-500 overflow-hidden relative flex flex-col justify-between">
                            {/* Hover Neon Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3]/0 to-[#00FFA3]/0 group-hover:from-[#00FFA3]/5 group-hover:to-transparent transition-colors duration-500"></div>

                            <CardHeader className="relative z-10 pb-2">
                                <div className="w-12 h-12 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-6 h-6 text-[#00FFA3]" />
                                </div>
                                <CardTitle className="text-2xl font-bold font-sans text-white group-hover:text-[#00FFA3] transition-colors">Historical Backtester</CardTitle>
                                <CardDescription className="text-gray-400 font-sans text-base mt-2">
                                    Test your cross-chain strategies against precise historical data from native parachain APIs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 flex-grow pt-4 flex items-end">
                                {/* Abstract API Graph visual */}
                                <div className="w-full h-24 flex items-end justify-between gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                    {[20, 45, 30, 60, 40, 75, 50, 90, 65, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Item 2: IL Simulator (Spans 1 col, 2 rows implicitly but we'll make it 1 row, wait it needs to fit carefully)  */}
                    {/* Actually, let's keep all 1 row span. */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="md:col-span-1 group flex"
                    >
                        <Card className="w-full h-full bg-[#101810]/40 border-white/5 backdrop-blur-md hover:border-[#00FFA3]/50 transition-all duration-500 relative flex flex-col justify-between overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFA3]/0 to-[#00FFA3]/0 group-hover:from-[#00FFA3]/5 group-hover:to-transparent transition-colors duration-500"></div>
                            <CardHeader className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Scale className="w-6 h-6 text-[#00FFA3]" />
                                </div>
                                <CardTitle className="text-2xl font-bold font-sans text-white group-hover:text-[#00FFA3] transition-colors">IL Simulator</CardTitle>
                                <CardDescription className="text-gray-400 font-sans text-base mt-2">
                                    Calculate and visualize potential Impermanent Loss.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 flex-grow pt-4">
                                <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
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
                        className="md:col-span-3 group flex"
                    >
                        <Card className="w-full h-full bg-[#101810]/40 border-white/5 backdrop-blur-md hover:border-[#00FFA3]/50 transition-all duration-500 overflow-hidden relative flex flex-col md:flex-row items-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFA3]/0 to-transparent group-hover:via-[#00FFA3]/5 transition-colors duration-700"></div>

                            <div className="md:w-1/2 flex flex-col justify-center h-full">
                                <CardHeader className="relative z-10">
                                    <div className="w-12 h-12 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Network className="w-6 h-6 text-[#00FFA3]" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold font-sans text-white group-hover:text-[#00FFA3] transition-colors">XCM Fee Optimizer</CardTitle>
                                    <CardDescription className="text-gray-400 font-sans text-base mt-2 max-w-md">
                                        Analyze cross-chain message fees to find the most efficient transfer routes between parachains like Acala, Moonbeam, and Bifrost.
                                    </CardDescription>
                                </CardHeader>
                            </div>

                            <CardContent className="md:w-1/2 h-full relative z-10 flex items-center justify-center p-6 w-full">
                                {/* Visual network representation */}
                                <div className="w-full max-w-sm h-32 relative border border-white/10 rounded-xl bg-black/50 p-4 flex items-center justify-between overflow-hidden group-hover:border-[#00FFA3]/30 transition-colors">
                                    <div className="w-12 h-12 rounded-full border border-[#00FFA3] flex items-center justify-center bg-[#00FFA3]/10 z-10">
                                        <div className="w-2 h-2 bg-[#00FFA3] rounded-full animate-pulse shadow-[0_0_10px_#00FFA3]" />
                                    </div>
                                    <div className="flex-grow h-px bg-gradient-to-r from-[#00FFA3]/50 via-transparent to-white/20 relative mx-2">
                                        <div className="absolute top-1/2 left-0 w-4 h-4 -translate-y-1/2 -translate-x-1/2 bg-[#00FFA3] blur-[8px] rounded-full group-hover:animate-[ping_2s_infinite]" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 z-10">
                                        <div className="w-2 h-2 bg-white/50 rounded-full" />
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
