"use client";

import { motion } from "framer-motion";

import metrics from "@/data/metrics.json";

export default function KeyMetricsSection() {
    return (
        <section className="mb-20 relative z-10 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="clay-card rounded-xl p-6 shadow-clay-lg flex flex-col gap-3 border border-white bg-white/60"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-slate-900 font-semibold text-base">{metric.label}</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl shadow-clay-sm">{metric.icon}</span>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-4xl font-bold tracking-tight text-slate-900">{metric.value}</h3>
                            <div className="flex items-center gap-1 text-primary-dark mt-2">
                                <span className="material-symbols-outlined text-sm">{metric.trend === 'up' ? 'trending_up' : metric.trend}</span>
                                <p className="text-sm font-bold">{metric.trendLabel}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
