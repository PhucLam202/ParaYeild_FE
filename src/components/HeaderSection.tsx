"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function HeaderSection() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-dark/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-heading font-bold text-white tracking-tighter">
                        ParaYield<span className="text-brand-pink">_Lab</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link href="#features" className="hover:text-brand-pink transition-colors">Features</Link>
                        <Link href="#ecosystem" className="hover:text-brand-pink transition-colors">Ecosystem</Link>
                        <Link href="#how-it-works" className="hover:text-brand-pink transition-colors">How it Works</Link>
                    </nav>
                </div>

                <div className="flex items-center">
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2 group">
                        Launch App
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
}
