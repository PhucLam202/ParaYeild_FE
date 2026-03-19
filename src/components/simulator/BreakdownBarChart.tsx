"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";
import type { SimulationResponse } from "@/types/simulator";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
    simulationResult: SimulationResponse;
}

export default function BreakdownBarChart({ simulationResult }: Props) {
    const { summary, breakdown } = simulationResult;

    const metrics = useMemo(() => {
        const totalYield = breakdown.reduce((acc, b) => acc + b.returnUsd, 0);
        const totalIL = breakdown.reduce((acc, b) => acc + Math.abs(b.ilLossUsd), 0);
        const xcmFees = summary.xcmFeesPaidUsd;
        const slippage = summary.slippageCostUsd ?? 0;

        return { totalYield, totalIL, xcmFees, slippage };
    }, [summary, breakdown]);

    const chartData: ChartData<"bar"> = useMemo(() => ({
        labels: ["Yield Earned", "IL Loss", "XCM Fees", "Slippage"],
        datasets: [
            {
                data: [
                    metrics.totalYield,
                    -metrics.totalIL,
                    -metrics.xcmFees,
                    -metrics.slippage,
                ],
                backgroundColor: [
                    "rgba(76,175,80,0.8)",
                    "rgba(239,68,68,0.8)",
                    "rgba(100,116,139,0.8)",
                    "rgba(249,115,22,0.8)",
                ],
                borderColor: [
                    "rgba(76,175,80,1)",
                    "rgba(239,68,68,1)",
                    "rgba(100,116,139,1)",
                    "rgba(249,115,22,1)",
                ],
                borderWidth: 1,
                borderRadius: 8,
                barPercentage: 0.6,
            },
        ],
    }), [metrics]);

    const options: ChartOptions<"bar"> = useMemo(() => ({
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(255,255,255,0.95)",
                titleColor: "#64748b",
                bodyColor: "#1e293b",
                borderColor: "rgba(0,0,0,0.06)",
                borderWidth: 1,
                cornerRadius: 12,
                padding: 14,
                titleFont: { size: 11, weight: "bold" as const },
                bodyFont: { size: 13, weight: "bold" as const },
                callbacks: {
                    label: (item) => {
                        const val = item.parsed.x ?? 0;
                        const sign = val >= 0 ? "+" : "";
                        return ` ${sign}$${Math.abs(val).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(0,0,0,0.03)" },
                border: { display: false },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 10, weight: "bold" as const },
                    callback: (value: string | number) => {
                        const num = typeof value === "string" ? parseFloat(value) : value;
                        return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
                    },
                },
            },
            y: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: "#64748b",
                    font: { size: 11, weight: "bold" as const },
                },
            },
        },
    }), []);

    return (
        <div className="clay-card rounded-clay-lg p-5 md:p-6 lg:p-8 space-y-5">
            <div>
                <h3 className="text-xl font-black font-display text-slate-800">Yield Breakdown</h3>
                <p className="text-sm font-bold text-slate-400">
                    Yield earned vs losses from IL, fees, and slippage
                </p>
            </div>
            <div className="relative w-full h-[200px] clay-inset rounded-3xl p-4 md:p-5">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
