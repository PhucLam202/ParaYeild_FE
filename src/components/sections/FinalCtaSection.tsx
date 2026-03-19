"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCtaSection() {
    return (
        <section id="final-cta" className="mt-20 mb-10 p-10 md:p-14 rounded-2xl shadow-clay-lg bg-white relative overflow-hidden flex flex-col items-center text-center gap-6 border border-white w-full scroll-mt-32">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold text-slate-900 max-w-5xl"
            >
                Your next yield move should be backed by data
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 text-lg max-w-3xl"
            >
                Run the scenario, inspect the tradeoffs, and enter the market with a clearer view of risk, fees, and upside.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
            >
                <Link href="/simulator">
                    <button className="clay-button h-12 px-8 bg-primary text-white text-base font-bold rounded-2xl shadow-clay-primary hover:-translate-y-1 transition-transform">
                        Open The Simulator
                    </button>
                </Link>

            </motion.div>
        </section>
    );
}
