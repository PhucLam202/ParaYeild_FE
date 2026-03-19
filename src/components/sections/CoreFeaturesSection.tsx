"use client";

import { motion } from "framer-motion";

import features from "@/data/features.json";

export default function CoreFeaturesSection() {
    return (
        <section id="decision-clarity" className="flex flex-col gap-10 py-8 w-full relative z-10 scroll-mt-32">
            <div className="text-center max-w-4xl mx-auto flex flex-col gap-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                >
                    Why DeFi decisions feel clearer here
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600 text-base md:text-lg"
                >
                    Every screen is designed to answer the question that matters most: is this pool still worth entering after fees, slippage, and impermanent loss?
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                        className="clay-card p-8 rounded-2xl shadow-clay-md flex flex-col items-center text-center gap-5 border border-white/50"
                    >
                        <div
                            className="size-[4.5rem] bg-slate-100 rounded-3xl shadow-clay-sm flex items-center justify-center text-primary transform"
                            style={{ transform: `rotate(${feature.rotate}deg)` }}
                        >
                            <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
