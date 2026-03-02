import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "error" | "success" | "info" | "warning";

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = "info", onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "error": return <AlertCircle className="w-5 h-5 text-red-400" />;
            case "success": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-amber-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case "error": return "bg-red-500/10 border-red-500/30 text-red-200 shadow-red-500/10";
            case "success": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-200 shadow-emerald-500/10";
            case "warning": return "bg-amber-500/10 border-amber-500/30 text-amber-200 shadow-amber-500/10";
            default: return "bg-blue-500/10 border-blue-500/30 text-blue-200 shadow-blue-500/10";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${getColors()} max-w-md`}
        >
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-grow pr-4 text-sm font-medium leading-relaxed">
                {message}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity p-1"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function ToastContainer({ toasts, removeToast }: { toasts: { id: string, message: string, type: ToastType }[], removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-0 right-0 p-8 flex flex-col gap-4 z-[100] pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
