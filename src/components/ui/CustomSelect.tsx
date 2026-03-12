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
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2">
                    {label}
                </label>
            )}
            <div
                className={`w-full clay-inset rounded-2xl p-4 flex items-center justify-between font-bold text-slate-700 transition-all ${isOpen ? 'ring-4 ring-primary/10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-2 hover:ring-primary/20'}`}
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
                                <div className={`size-5 rounded-full ${selectedOption.colorIndicator} flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                    {selectedOption.label[0]}
                                </div>
                            )}
                            <span className="truncate">{selectedOption.label}</span>
                        </>
                    ) : (
                        <span className="text-slate-400">{placeholder}</span>
                    )}
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="material-symbols-outlined text-primary/60 flex-shrink-0 pointer-events-none"
                >
                    expand_more
                </motion.span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-clay-lg overflow-hidden max-h-60 overflow-y-auto px-2 py-2 border border-slate-100"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors rounded-xl font-bold ${value === option.value
                                    ? "bg-primary/10 text-primary-dark"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
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
                                    <div className={`size-5 rounded-full ${option.colorIndicator} flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                        {option.label[0]}
                                    </div>
                                )}
                                <span className="truncate capitalize">{option.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
