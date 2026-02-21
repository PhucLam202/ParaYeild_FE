"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, SlidersHorizontal, Play, LineChart } from "lucide-react";

export default function HowItWorksSection() {
    const pipelineSteps = [
        {
            id: "step-1",
            title: "Data Source",
            icon: Database,
            heading: "Select Historical Data Sources",
            description: "Choose from multiple Polkadot parachains to fetch highly accurate historical liquidity and pricing data. Our indexer continually synchronizes with Acala, Bifrost, and Hydration.",
            features: ["Multi-chain data aggregation", "High-fidelity tick data", "Real-time synchronization"]
        },
        {
            id: "step-2",
            title: "Parameters",
            icon: SlidersHorizontal,
            heading: "Configure Strategy Parameters",
            description: "Set your simulation parameters including relative token weights, virtual amounts, trading fee tiers, and the specific historical timeframe you want to analyze.",
            features: ["Custom timeframes", "Dynamic token weights", "Fee tier configuration"]
        },
        {
            id: "step-3",
            title: "Simulation",
            icon: Play,
            heading: "Run Cross-Chain Simulation",
            description: "Execute the backtest engine. Our simulator locally computes the exact impermanent loss, accrued fees, and overall yield based on the parameters configured.",
            features: ["Local compute engine", "Millisecond execution", "Accurate IL math"]
        },
        {
            id: "step-4",
            title: "Analysis",
            icon: LineChart,
            heading: "Analyze Yield & Optimization",
            description: "Visualize the resulting equity curve, analyze the breakdown of yields vs. impermanent loss, and discover potential XCM routing optimizations for subsequent deployments.",
            features: ["Equity curve visualization", "XCM fee comparison", "Yield breakdown"]
        }
    ];

    return (
        <section className="py-24 bg-[#0A0F0A] relative border-t border-white/5">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-sans font-bold mb-6 text-white"
                    >
                        Simulation <span className="text-gradient">Pipeline</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto font-sans"
                    >
                        Four simple steps to backtest and optimize your DeFi yield strategies.
                    </motion.p>
                </div>

                <div className="w-full">
                    <Tabs defaultValue="step-1" className="w-full flex flex-col items-center">
                        <TabsList className="bg-black/50 border border-white/10 p-1 rounded-xl mb-12 flex flex-wrap h-auto justify-center gap-2">
                            {pipelineSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <TabsTrigger
                                        key={step.id}
                                        value={step.id}
                                        className="data-[state=active]:bg-[#00FFA3]/10 data-[state=active]:text-[#00FFA3] data-[state=active]:shadow-none rounded-lg font-mono tracking-wider uppercase text-xs md:text-sm py-3 px-6 text-gray-400 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Icon className="w-4 h-4" />
                                        {step.title}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        <div className="w-full bg-[#101810]/50 border border-white/5 p-8 md:p-12 rounded-2xl backdrop-blur-md relative overflow-hidden">
                            {/* Ambient glow inside container */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FFA3]/10 blur-[80px] rounded-full pointer-events-none"></div>

                            {pipelineSteps.map((step) => (
                                <TabsContent key={step.id} value={step.id} className="mt-0 outline-none">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-col md:flex-row gap-8 md:gap-16 items-center"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-bold font-sans text-white mb-4">{step.heading}</h3>
                                            <p className="text-gray-400 text-lg leading-relaxed mb-8">{step.description}</p>

                                            <ul className="space-y-4">
                                                {step.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 font-mono text-sm text-gray-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex-1 w-full h-[300px] rounded-xl border border-white/10 bg-black/50 relative flex items-center justify-center overflow-hidden group">
                                            {/* Abstract Visual Placeholder for the Pipeline Step */}
                                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]"></div>

                                            <div className="relative z-10 w-24 h-24 rounded-2xl bg-[#00FFA3]/5 border border-[#00FFA3]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00FFA3]/10 group-hover:border-[#00FFA3]/50 transition-all duration-500 shadow-[0_0_30px_rgba(0,255,163,0.1)]">
                                                <step.icon className="w-10 h-10 text-[#00FFA3]" />
                                            </div>

                                            {/* decorative scanning line */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#00FFA3]/50 to-transparent group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 hidden md:block" />
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}
