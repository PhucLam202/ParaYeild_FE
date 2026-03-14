import React from "react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-md transition-all duration-300">
            <div className="relative flex flex-col items-center gap-6">
                {/* Modern Pulse Loader */}
                <div className="relative size-24">
                    <div className="absolute inset-0 rounded-clay-lg bg-primary/20 animate-ping opacity-75"></div>
                    <div className="relative size-full rounded-clay-lg bg-white shadow-clay-md border-2 border-primary/10 flex items-center justify-center overflow-hidden">
                        <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center text-lg font-black shadow-clay-primary animate-pulse">
                            PY
                        </div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <span className="text-primary font-display font-black text-xl tracking-tight uppercase">
                        ParaYield Lab
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="size-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="size-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="size-1 rounded-full bg-primary/40 animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
