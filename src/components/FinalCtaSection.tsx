"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCtaSection() {
    return (
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-bg-darker">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-pink to-brand-purple opacity-90"></div>

            {/* Mesh/noise overlay to give it texture */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>

            {/* Animated glowing orbs inside CTA */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-1/4 w-64 h-64 bg-white rounded-full blur-[100px] mix-blend-overlay"
            ></motion.div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white"
                >
                    Ready to Optimize Your DeFi Strategy?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 text-xl max-w-2xl mx-auto mb-10 font-sans"
                >
                    Join traders analyzing over $450 million in liquidity across the Polkadot ecosystem.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <button className="px-8 py-4 bg-white text-brand-purple rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto group">
                        Start Backtesting Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
