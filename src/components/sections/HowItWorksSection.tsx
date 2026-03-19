"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import stepsData from "@/data/how-it-works.json";

const steps = stepsData.map(step => ({
    ...step,
    icon: LucideIcons[step.iconName as keyof typeof LucideIcons] || LucideIcons.HelpCircle
}));

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-[#0A0C14] relative border-t border-white/5">
            <div className="ambient-glow absolute w-[500px] h-[500px] bg-[#552BBF]/8 right-0 top-0" />

            <div className="container mx-auto px-6 max-w-[1440px] relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-sans font-bold mb-6 text-white"
                    >
                        From raw market data to a <span className="text-gradient">clearer decision</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto font-sans"
                    >
                        A simple four-step flow for evaluating whether a yield opportunity deserves your capital.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00FFA3]/40 via-[#552BBF]/30 to-transparent hidden sm:block" style={{ transform: "translateX(-50%)" }} />

                    <div className="space-y-16 md:space-y-24">
                        {steps.map((step, index) => {
                            const Icon = step.icon as React.ElementType;
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-center ${isEven ? "" : "md:flex-row-reverse"}`}
                                >
                                    {/* Step number node on the center line */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full items-center justify-center z-10 font-mono font-bold text-sm"
                                        style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}50`, color: step.color }}
                                    >
                                        {step.num}
                                    </div>

                                    {/* Text side */}
                                    <div className="flex-1 md:max-w-[calc(50%-60px)]">
                                        {/* Mobile step number */}
                                        <div className="flex items-center gap-3 mb-4 md:hidden">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                                                style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}40`, color: step.color }}
                                            >
                                                {step.num}
                                            </div>
                                            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">{step.title}</span>
                                        </div>
                                        <p className="hidden md:block text-xs font-mono uppercase tracking-widest mb-3" style={{ color: step.color }}>{step.title}</p>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-sans">{step.heading}</h3>
                                        <p className="text-gray-400 leading-relaxed mb-6">{step.description}</p>
                                        <ul className="space-y-3">
                                            {step.features.map((f) => (
                                                <li key={f} className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: step.color }} />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Visual side */}
                                    <div className="flex-1 md:max-w-[calc(50%-60px)] w-full">
                                        <div className="h-48 md:h-56 rounded-2xl border border-white/8 bg-[#0A0C14] relative overflow-hidden group flex items-center justify-center"
                                            style={{ boxShadow: `0 0 40px ${step.color}08` }}
                                        >
                                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.04]" />
                                            <div className="absolute inset-0 bg-gradient-to-br"
                                                style={{ backgroundImage: `radial-gradient(ellipse at 60% 40%, ${step.color}10 0%, transparent 70%)` }}
                                            />
                                            {/* Top accent */}
                                            <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: step.color, opacity: 0.3 }} />

                                            <div className="relative z-10 flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                                                    style={{ backgroundColor: `${step.color}10`, border: `1px solid ${step.color}30` }}
                                                >
                                                    <Icon className="w-8 h-8" style={{ color: step.color }} />
                                                </div>
                                                {/* Decorative dots */}
                                                <div className="flex gap-1.5">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-1.5 h-1.5 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
                                                            style={{ backgroundColor: step.color, transitionDelay: `${i * 80}ms` }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
