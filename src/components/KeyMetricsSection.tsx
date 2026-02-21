"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
}

const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2 }: CounterProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);

            setCount(Math.floor(value * percentage));

            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span className="font-heading text-4xl md:text-5xl font-bold text-gradient">{prefix}{count}{suffix}</span>;
}

export default function KeyMetricsSection() {
    const metrics = [
        { title: "Total Value Tracked", value: 450, prefix: "$", suffix: "M" },
        { title: "Indexed Across 3 Chains", value: 120, prefix: "", suffix: "+ Pools" },
        { title: "Historical Data", value: 18, prefix: "", suffix: " Months" },
        { title: "Real-time Updates", value: 24, prefix: "", suffix: "/7" },
    ];

    return (
        <section className="py-20 relative z-10 -mt-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="mb-2">
                                <AnimatedCounter
                                    value={metric.value}
                                    suffix={metric.suffix}
                                    prefix={metric.prefix}
                                />
                            </div>
                            <p className="text-gray-400 font-medium text-sm tracking-wide uppercase">{metric.title}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
