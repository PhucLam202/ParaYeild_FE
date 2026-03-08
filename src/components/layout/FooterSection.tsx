import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const columns = [
    {
        heading: "Product",
        links: [
            { label: "Simulator", href: "/simulator" },
            { label: "Features", href: "/#features" },
            { label: "How it Works", href: "/#how-it-works" },
            { label: "Ecosystem", href: "/#ecosystem" },
        ],
    },
    {
        heading: "Resources",
        links: [
            { label: "Documentation", href: "#" },
            { label: "API Reference", href: "#" },
            { label: "Changelog", href: "#" },
            { label: "Status", href: "#" },
        ],
    },
    {
        heading: "Community",
        links: [
            { label: "Twitter / X", href: "#" },
            { label: "GitHub", href: "#" },
            { label: "Discord", href: "#" },
            { label: "Polkadot Forum", href: "#" },
        ],
    },
];

export default function FooterSection() {
    return (
        <footer className="relative bg-[#050714] border-t border-white/5">
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFA3]/20 to-transparent" />

            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-xl font-bold text-white tracking-tight">
                                ParaYield<span className="text-[#00FFA3]">_Lab</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Advanced DeFi analytics and yield simulation for the Polkadot ecosystem.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all text-[10px] font-bold tracking-tight">
                                DC
                            </Link>
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.heading}>
                            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">{col.heading}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>&copy; {new Date().getFullYear()} ParaYield_Lab. All rights reserved.</p>
                    <p>Built on <span className="text-[#E6007A] font-semibold">Polkadot</span> · Non-custodial · Open source</p>
                </div>
            </div>
        </footer>
    );
}
