"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    color: string;
}

const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2, color }: CounterProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            setCount(Math.floor(value * percentage));
            if (percentage < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span className="font-heading text-4xl md:text-5xl font-bold" style={{ color }}>
            {prefix}{count}{suffix}
        </span>
    );
};

export default function KeyMetricsSection() {
    const [secondsAgo, setSecondsAgo] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setSecondsAgo(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const metrics = [
        { title: "Total Value Tracked", value: 450, prefix: "$", suffix: "M", color: "#00FFA3", label: "Across active pools" },
        { title: "Live Pools Indexed", value: 120, prefix: "", suffix: "+", color: "#60A5FA", label: "Acala · Hydration · Bifrost" },
        { title: "Historical Data", value: 18, prefix: "", suffix: " Mo", color: "#A78BFA", label: "High-fidelity tick data" },
        { title: "Real-time Sync", value: 24, prefix: "", suffix: "/7", color: "#FB923C", label: "Always on" },
    ];

    return (
        <section className="py-16 relative z-10 -mt-16">
            <div className="container mx-auto px-6">
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-4">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.05 * index }}
                                className="relative flex flex-col items-center justify-center text-center p-8 group"
                            >
                                {/* Vertical dividers between items */}
                                {index > 0 && (
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-white/5" />
                                )}
                                {/* Horizontal dividers on mobile (between row 1 and row 2) */}
                                {index >= 2 && (
                                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-white/5 lg:hidden" />
                                )}
                                {/* Bottom accent on hover */}
                                <div
                                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ backgroundColor: metric.color }}
                                />
                                <div className="mb-1">
                                    <AnimatedCounter
                                        value={metric.value}
                                        suffix={metric.suffix}
                                        prefix={metric.prefix}
                                        color={metric.color}
                                    />
                                </div>
                                <p className="text-white font-semibold text-sm mb-1">{metric.title}</p>
                                <p className="text-gray-500 text-xs font-mono">{metric.label}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center py-3 border-t border-white/5">
                        <p className="text-xs font-mono text-gray-600">
                            Live · Updated {secondsAgo}s ago
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}