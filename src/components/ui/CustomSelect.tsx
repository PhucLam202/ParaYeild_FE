import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
    colorIndicator?: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
    disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    className = "",
    label,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={`relative ${className} ${isOpen ? 'z-[100]' : 'z-10'}`} ref={dropdownRef}>
            {label && (
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {label}
                </label>
            )}
            <div
                className={`w-full bg-white/5 border ${isOpen ? 'border-accent-neon outline-none ring-1 ring-accent-neon/50' : 'border-white/10'} rounded-lg py-3 px-4 flex items-center justify-between text-white transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10 hover:border-white/20'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 truncate">
                    {selectedOption ? (
                        <>
                            {selectedOption.icon && (
                                <span className="flex-shrink-0 flex items-center justify-center">
                                    {selectedOption.icon}
                                </span>
                            )}
                            {selectedOption.colorIndicator && (
                                <div className={`size-4 rounded-full ${selectedOption.colorIndicator} flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white`}>
                                    {selectedOption.label[0]}
                                </div>
                            )}
                            <span className="truncate font-medium capitalize">{selectedOption.label}</span>
                        </>
                    ) : (
                        <span className="text-slate-500 font-medium">{placeholder}</span>
                    )}
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="material-symbols-outlined text-slate-400 flex-shrink-0"
                >
                    arrow_drop_down
                </motion.span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-3 cursor-pointer flex items-center gap-2 transition-colors ${value === option.value
                                    ? "bg-accent-neon/10 text-accent-neon border-l-2 border-accent-neon"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white border-l-2 border-transparent"
                                    }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.icon && (
                                    <span className="flex-shrink-0 flex items-center justify-center">
                                        {option.icon}
                                    </span>
                                )}
                                {option.colorIndicator && (
                                    <div className={`size-4 rounded-full ${option.colorIndicator} flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white`}>
                                        {option.label[0]}
                                    </div>
                                )}
                                <span className="truncate capitalize font-medium">{option.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
