"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SupportedParachainsSection() {
    const chains = [
        {
            name: "Moonbeam",
            subtitle: "EVM Smart Contracts",
            stats: "Top dApp Hub",
            color: "#53CBC9",
        },
        {
            name: "Astar",
            subtitle: "WASM + EVM Platform",
            stats: "Multi-VM Network",
            color: "#1b6dc1",
        },
        {
            name: "Phala Network",
            subtitle: "Confidential Compute",
            stats: "Secure Workers",
            color: "#D1FE1D",
        },
        {
            name: "Centrifuge",
            subtitle: "Real-World Assets",
            stats: "RWA Tokenization",
            color: "#FACC15",
        },
        {
            name: "Interlay",
            subtitle: "Bitcoin Bridging",
            stats: "Wrapped BTC (iBTC)",
            color: "#F7931A",
        },
        {
            name: "Parallel",
            subtitle: "DeFi Lending",
            stats: "Borrow / Lend",
            color: "#EF4444",
        },
        {
            name: "Manta Network",
            subtitle: "Modular Blockchain",
            stats: "Privacy-Preserving",
            color: "#11B4ED",
        },
        {
            name: "Nodle",
            subtitle: "IoT Connectivity",
            stats: "Mobile Network",
            color: "#00CDFF",
        },
        {
            name: "Acala",
            subtitle: "Stablecoin & DeFi",
            stats: "24 Pools Indexed",
            color: "#FF3E3E",
        },
        {
            name: "Bifrost",
            subtitle: "Liquid Staking",
            stats: "18 vTokens Tracked",
            color: "#00CDFF",
        },
        {
            name: "Hydration",
            subtitle: "Omnipool DEX",
            stats: "$42M Liquidity",
            color: "#FF007A",
        }
    ];

    const radiusX = 450; // Horizontal spread for larger screens
    const radiusY = 300; // Vertical spread for standard 16:9

    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[#020402]"></div>

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] bg-[#00FFA3]/5 blur-[120px] rounded-full mix-blend-screen transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-32">
                    <Badge variant="outline" className="border-[#00FFA3]/50 text-[#00FFA3] bg-[#00FFA3]/5 px-4 py-1.5 mb-6 backdrop-blur-md rounded-none font-mono text-sm uppercase tracking-wider">
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
                        className="text-gray-400 text-lg md:text-xl font-sans"
                    >
                        Indexing cross-chain data through the decentralized Mycelium network.
                    </motion.p>
                </div>

                <div className="relative w-full max-w-[1000px] md:h-[800px] flex flex-col md:flex-row items-center justify-center">

                    {/* SVG Connections for Desktop */}
                    <div className="absolute inset-0 pointer-events-none hidden md:block z-0">
                        <svg className="w-full h-full" style={{ overflow: "visible" }}>
                            <defs>
                                {chains.map((chain, index) => (
                                    <linearGradient key={`gradient-${index}`} id={`glowLine-${index}`} x1="50%" y1="50%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor={chain.color} stopOpacity="0.3" />
                                    </linearGradient>
                                ))}
                            </defs>

                            {chains.map((chain, index) => {
                                const angle = (index / chains.length) * 2 * Math.PI - Math.PI / 2;
                                const endX = Math.cos(angle) * (radiusX - 80);
                                const endY = Math.sin(angle) * (radiusY - 80);

                                const cpX = Math.cos(angle) * (radiusX * 0.4);
                                const cpY = Math.sin(angle) * (radiusY * 0.4);

                                return (
                                    <motion.path
                                        key={`path-${index}`}
                                        d={`M 50% 50% Q calc(50% + ${cpX}px) calc(50% + ${cpY}px), calc(50% + ${endX}px) calc(50% + ${endY}px)`}
                                        fill="none"
                                        stroke={`url(#glowLine-${index})`}
                                        strokeWidth="1.5"
                                        strokeDasharray="4 6"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: index * 0.05, ease: "easeInOut" }}
                                    />
                                );
                            })}
                        </svg>
                    </div>

                    {/* Central Node */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative md:absolute z-20 mb-16 md:mb-0"
                    >
                        <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border border-[#00FFA3]/30 bg-[#101810]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 shadow-[0_0_80px_rgba(0,255,163,0.2)] relative group cursor-pointer z-20">
                            <div className="absolute inset-0 bg-[#00FFA3]/10 rounded-full animate-ping opacity-20 duration-1000"></div>
                            <div className="w-4 h-4 rounded-full bg-[#00FFA3] shadow-[0_0_20px_#00FFA3] mb-3 group-hover:scale-125 transition-transform duration-500"></div>
                            <span className="font-sans font-bold text-white text-lg md:text-xl">ParaYield</span>
                            <span className="font-mono text-xs md:text-sm text-[#00FFA3]/80 uppercase tracking-widest mt-1 text-center">Core<br />Engine</span>
                        </div>
                    </motion.div>

                    {/* Surrounding Nodes */}
                    <div className="flex flex-wrap md:block justify-center gap-4 w-full relative z-10 px-4 md:px-0 mt-8 md:mt-0">
                        {chains.map((chain, index) => {
                            const angle = (index / chains.length) * 2 * Math.PI - Math.PI / 2;
                            const x = Math.cos(angle) * radiusX;
                            const y = Math.sin(angle) * radiusY;

                            return (
                                <div key={index}>
                                    {/* Desktop mapping injected styles */}
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                            @media (min-width: 768px) {
                                                .node-${index} {
                                                    position: absolute !important;
                                                    left: calc(50% + ${x}px) !important;
                                                    top: calc(50% + ${y}px) !important;
                                                    transform: translate(-50%, -50%) !important;
                                                }
                                            }
                                        `
                                    }} />
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 80, delay: 0.05 * (index + 1) }}
                                        className={`node-${index} relative flex justify-center w-full sm:w-[calc(50%-8px)] md:w-auto transition-transform duration-500 hover:scale-[1.03] hover:z-30 cursor-pointer group`}
                                    >
                                        <div className="flex flex-col items-center w-full md:w-auto">
                                            {/* Node Dot (Visible on Desktop only) */}
                                            <div className="hidden md:flex w-8 h-8 rounded-full border border-white/10 bg-[#0A0F0A]/90 backdrop-blur-md items-center justify-center mb-3 relative shadow-lg group-hover:border-white/30 transition-colors z-10">
                                                <div className="w-2 h-2 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-150" style={{ backgroundColor: chain.color, boxShadow: `0 0 10px ${chain.color}` }}></div>
                                            </div>

                                            {/* Info Card */}
                                            <div className="w-full md:w-auto bg-[#101810]/95 border border-white/5 backdrop-blur-md p-3 rounded-lg md:min-w-[170px] text-center shadow-xl group-hover:border-white/20 transition-all cursor-default z-10 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-50 transition-opacity group-hover:opacity-100" style={{ backgroundColor: chain.color }}></div>

                                                <h3 className="text-sm font-bold font-sans text-white mb-1">{chain.name}</h3>
                                                <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2 h-6 flex items-center justify-center leading-tight">{chain.subtitle}</p>
                                                <div className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-gray-300 font-mono bg-black/50 py-1.5 px-2 rounded border border-white/5">
                                                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: chain.color }} />
                                                    <span className="truncate">{chain.stats}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
