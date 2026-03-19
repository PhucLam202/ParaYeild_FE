"use client";

import React from "react";
import { motion } from "framer-motion";

import parachainsData from "@/data/parachains.json";

const PARACHAINS = parachainsData.filter(p => p.orbit);

const ParachainSection = () => {
    return (
        <section id="cross-chain-context" className="py-20 relative overflow-hidden w-full max-w-none my-10 scroll-mt-32">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-slate-300" strokeWidth="0.5"></path>
                    </pattern>
                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-5 md:px-12 relative z-10 w-full">
                <div className="text-center mb-14 flex flex-col gap-3">
                    <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/10 px-4 py-2 rounded-full w-fit mx-auto">Cross-Chain Context</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">One view across the Polkadot yield landscape</h2>
                    <p className="text-slate-600 text-base md:text-lg max-w-4xl mx-auto font-medium">Track how liquidity opportunities connect across parachains so you can compare routes, pools, and strategy assumptions without stitching the data together yourself.</p>
                </div>

                <div className="relative h-[620px] flex items-center justify-center scale-[0.82] md:scale-100">
                    {/* Relay Chain Center */}
                    <div className="relative z-30 group">
                        <div className="size-40 bg-white rounded-full shadow-clay-lg flex flex-col items-center justify-center text-slate-800 border border-white hover:scale-105 transition-transform duration-500">
                            <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-clay-sm overflow-hidden">
                                <img src="/polkadot-new-dot-logo.svg" className="w-9 h-9 object-contain" alt="Polkadot" />
                            </div>
                            <span className="text-lg font-bold tracking-widest uppercase text-slate-900">Relay</span>
                            <span className="text-xs font-semibold text-slate-500 tracking-widest">CHAIN</span>
                            {/* Inner glow for clay effect */}
                            <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_4px_4px_12px_rgba(255,255,255,0.8),inset_-4_4_12px_rgba(46,125,50,0.1)]"></div>
                        </div>
                    </div>

                    {/* Orbiting Parachains */}
                    {PARACHAINS.map((para) => (
                        <motion.div
                            key={para.id}
                            className="absolute flex items-center justify-center"
                            style={{
                                width: 0,
                                height: 0,
                                transformOrigin: "0 0",
                            }}
                            animate={{
                                rotate: [para.orbit!.initialAngle, para.orbit!.initialAngle + 360],
                            }}
                            transition={{
                                duration: para.orbit!.speed,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            {/* Connection Line */}
                            <div
                                className="absolute pointer-events-none"
                                style={{
                                    width: para.orbit!.radius,
                                    height: "2px",
                                    left: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "repeating-linear-gradient(90deg, #4CAF50, #4CAF50 4px, transparent 4px, transparent 8px)",
                                    opacity: 0.3
                                }}
                            />

                            {/* Node Container */}
                            <motion.div
                                className="absolute flex flex-col items-center gap-3"
                                style={{
                                    left: para.orbit!.radius,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                {/* Counter-rotation to keep icons upright */}
                                <motion.div
                                    animate={{
                                        rotate: [-(para.orbit!.initialAngle), -(para.orbit!.initialAngle + 360)],
                                    }}
                                    transition={{
                                        duration: para.orbit!.speed,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="size-20 bg-white rounded-3xl shadow-clay-md flex items-center justify-center border border-white hover:border-primary/30 transition-colors cursor-pointer group p-4 overflow-hidden"
                                    >
                                        {para.icon?.startsWith("/") ? (
                                            <img src={para.icon} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" alt={para.name} />
                                        ) : (
                                            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">{para.icon}</span>
                                        )}
                                    </motion.div>
                                    <span className="text-slate-700 font-bold text-[13px] tracking-wide bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white shadow-clay-sm whitespace-nowrap">
                                        {para.name}
                                    </span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ParachainSection;
