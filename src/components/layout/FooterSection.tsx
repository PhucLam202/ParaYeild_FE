import Link from "next/link";

export default function FooterSection() {
    return (
        <footer className="px-6 md:px-20 py-12 border-t border-slate-200 mt-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                    <span className="text-xl font-bold text-slate-900">ParaYield Lab</span>
                </div>
                <div className="flex gap-8 text-slate-500 font-semibold">
                    <Link className="hover:text-primary transition-colors" href="https://x.com/PLtheCoder" target="_blank">X</Link>
                    <Link className="hover:text-primary transition-colors" href="https://github.com/PhucLam202" target="_blank">Github</Link>
                </div>
                <p className="text-slate-400 text-sm">© 2026 ParaYield Lab. Built on Polkadot.</p>
            </div>
        </footer>
    );
}
