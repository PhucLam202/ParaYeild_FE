"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const chains = [
    { name: "Acala", subtitle: "Stablecoin & DeFi", stats: "24 Pools Indexed", color: "#FF3E3E" },
    { name: "Bifrost", subtitle: "Liquid Staking", stats: "18 vTokens Tracked", color: "#00CDFF" },
    { name: "Hydration", subtitle: "Omnipool DEX", stats: "$42M Liquidity", color: "#FF007A" },
    { name: "Moonbeam", subtitle: "EVM Smart Contracts", stats: "Top dApp Hub", color: "#53CBC9" },
    { name: "Astar", subtitle: "WASM + EVM Platform", stats: "Multi-VM Network", color: "#1b6dc1" },
    { name: "Phala Network", subtitle: "Confidential Compute", stats: "Secure Workers", color: "#D1FE1D" },
    { name: "Centrifuge", subtitle: "Real-World Assets", stats: "RWA Tokenization", color: "#FACC15" },
    { name: "Interlay", subtitle: "Bitcoin Bridging", stats: "Wrapped BTC (iBTC)", color: "#F7931A" },
    { name: "Parallel", subtitle: "DeFi Lending", stats: "Borrow / Lend", color: "#EF4444" },
    { name: "Manta Network", subtitle: "Modular Blockchain", stats: "Privacy-Preserving", color: "#11B4ED" },
    { name: "Nodle", subtitle: "IoT Connectivity", stats: "Mobile Network", color: "#00CDFF" },
];

export default function SupportedParachainsSection() {
    return (
        <section id="ecosystem" className="py-24 md:py-32 relative overflow-hidden bg-background">
            <div className="ambient-glow absolute w-[700px] h-[700px] bg-[#00FFA3]/4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <Badge variant="outline" className="border-[#00FFA3]/40 text-[#00FFA3] bg-[#00FFA3]/5 px-4 py-1.5 mb-6 backdrop-blur-md rounded-full font-mono text-xs uppercase tracking-wider">
                        Ecosystem
                    </Badge>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 text-white leading-tight"
                    >
                        Connected <span className="text-gradient">Parachains</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg font-sans"
                    >
                        Indexing cross-chain data through the decentralized Mycelium network.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {chains.map((chain, index) => (
                        <motion.div
                            key={chain.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: 0.04 * index }}
                            className="glass-card rounded-xl p-5 group cursor-default hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
                        >
                            {/* Chain color accent on top */}
                            <div
                                className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ backgroundColor: chain.color }}
                            />
                            {/* Color dot */}
                            <div
                                className="w-8 h-8 rounded-full mb-4 flex items-center justify-center"
                                style={{ backgroundColor: `${chain.color}18`, border: `1px solid ${chain.color}40` }}
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: chain.color, boxShadow: `0 0 8px ${chain.color}80` }}
                                />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">{chain.name}</h3>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-mono mb-3">{chain.subtitle}</p>
                            <div
                                className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded border"
                                style={{ color: chain.color, borderColor: `${chain.color}30`, backgroundColor: `${chain.color}08` }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: chain.color }} />
                                {chain.stats}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
