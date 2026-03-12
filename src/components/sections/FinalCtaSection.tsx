"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCtaSection() {
    return (
        <section className="mt-24 mb-12 p-12 md:p-20 rounded-2xl shadow-clay-lg bg-white relative overflow-hidden flex flex-col items-center text-center gap-8 border border-white w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-bold text-slate-900 max-w-3xl"
            >
                Ready to start earning smarter?
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 text-xl max-w-xl"
            >
                Join over 120,000 users building the future of decentralized finance on Polkadot.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6"
            >
                <Link href="/simulator">
                    <button className="clay-button h-16 px-10 bg-primary text-white text-xl font-bold rounded-2xl shadow-clay-primary hover:-translate-y-1 transition-transform">
                        Launch App Now
                    </button>
                </Link>
                <button className="clay-button h-16 px-10 bg-slate-100 text-slate-700 text-xl font-bold rounded-2xl shadow-clay-md hover:-translate-y-1 transition-transform">
                    Explore Assets
                </button>
            </motion.div>
        </section>
    );
}
