import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function FooterSection() {
    return (
        <footer className="bg-[#050714] border-t border-white/5 py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 border-b border-white/5 pb-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <span className="text-2xl font-heading font-bold text-white tracking-tighter">
                            ParaYield<span className="text-brand-pink">_Lab</span>
                        </span>
                        <p className="text-gray-400 text-sm">Advanced DeFi Analytics for Polkadot.</p>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-gray-300">
                        <Link href="#" className="hover:text-brand-pink transition-colors">About</Link>
                        <Link href="#" className="hover:text-brand-pink transition-colors">Documentation</Link>
                        <Link href="#" className="hover:text-brand-pink transition-colors">API</Link>
                    </div>

                    <div className="flex gap-4">
                        <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-pink transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-purple transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        {/* Discord Icon placeholder using text since lucide-react might not have Discord in all versions */}
                        <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5865F2] transition-colors font-bold text-xs uppercase tracking-tighter">
                            DIS
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} ParaYield_Lab. All rights reserved.</p>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <span>Built with <span className="text-brand-pink font-semibold">Polkadot</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
