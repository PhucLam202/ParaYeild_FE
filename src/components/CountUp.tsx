"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

export default function CountUp({
    from = 0,
    to,
    duration = 2,
    prefix = "",
    suffix = "",
    separator = ",",
    decimals = 0,
}: {
    from?: number;
    to: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    decimals?: number;
}) {
    const [hasHydrated, setHasHydrated] = useState(false);
    const count = useMotionValue(from);

    // We only formats the number properly into string
    const rounded = useTransform(count, (latest) => {
        // If it hasn't hydrated, show the `from` value to avoid hydration mismatch
        if (!hasHydrated) return `${prefix}${from}${suffix}`;

        // Format the number based on standard Intl.NumberFormat if requested
        const formatted = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(latest);

        // If custom separator is empty, remove commas
        const finalString = separator === "" ? formatted.replace(/,/g, "") : formatted;

        return `${prefix}${finalString}${suffix}`;
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        const animation = animate(count, to, { duration, ease: "easeOut" });
        return animation.stop;
    }, [count, to, duration]);

    // Don't render until hydration to avoid server-client text mismatch, 
    // or just render the component safely mapping to motion.span mapping the rounded value
    if (!hasHydrated) {
        return <span>{prefix}{from}{suffix}</span>;
    }

    return <motion.span>{rounded}</motion.span>;
}
