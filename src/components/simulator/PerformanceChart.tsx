"use client";

import { useRef, useMemo } from "react";
import { format } from "date-fns";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartOptions, ChartData, TooltipItem } from "chart.js";
import type { SimulationResponse, ChartMetricType } from "@/types/simulator";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const HODL_RETURN_PERCENT = 3.5;

interface Props {
    simulationResult: SimulationResponse;
    chartMetric: ChartMetricType;
    setChartMetric: (v: ChartMetricType) => void;
}

export default function PerformanceChart({
    simulationResult,
    chartMetric,
    setChartMetric,
}: Props) {
    const chartRef = useRef<ChartJS<"line">>(null);
    const initialAmount = simulationResult.summary.initialAmountUsd;
    const ts = simulationResult.timeSeries;
    
    // Choose color based on metric
    let color = "#4CAF50"; // default value
    if (chartMetric === "yield" || chartMetric === "return") color = "#8B5CF6";
    if (chartMetric === "profit") color = "#3B82F6";
    if (chartMetric === "rewards") color = "#F59E0B";

    const labels = useMemo(() => ts.map(p => format(new Date(p.date), "MMM dd")), [ts]);

    const strategyData = useMemo(() => {
        return ts.map(p => {
            switch (chartMetric) {
                case "value":
                    return p.totalValueUsd;
                case "profit":
                    return p.totalValueUsd - initialAmount;
                case "return":
                    return ((p.totalValueUsd - initialAmount) / initialAmount) * 100;
                case "yield":
                    return p.dailyReturnPct;
                case "rewards":
                    return p.unclaimedRewardsUsd || 0;
                default:
                    return p.totalValueUsd;
            }
        });
    }, [ts, chartMetric, initialAmount]);

    const hodlData = useMemo(() => {
        return ts.map((_, i) => {
            const hodlValue = initialAmount * (1 + (HODL_RETURN_PERCENT / 100) * (i / 365));
            switch (chartMetric) {
                case "value":
                    return hodlValue;
                case "profit":
                    return hodlValue - initialAmount;
                case "return":
                    return ((hodlValue - initialAmount) / initialAmount) * 100;
                case "yield":
                    return HODL_RETURN_PERCENT * (i / ts.length);
                case "rewards":
                    return 0; // HODL doesn't generate "rewards" in the same way
                default:
                    return hodlValue;
            }
        });
    }, [ts, chartMetric, initialAmount]);

    const chartData: ChartData<"line"> = useMemo(() => ({
        labels,
        datasets: [
            {
                label: "Strategy",
                data: strategyData,
                borderColor: color,
                borderWidth: 2.5,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
                fill: true,
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: canvasCtx, chartArea } = chart;
                    if (!chartArea) return "transparent";
                    const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    
                    let rgbColor = "76,175,80"; // value/default
                    if (chartMetric === "profit") rgbColor = "59,130,246";
                    if (chartMetric === "yield" || chartMetric === "return") rgbColor = "139,92,246";
                    if (chartMetric === "rewards") rgbColor = "245,158,11";
                    
                    gradient.addColorStop(0, `rgba(${rgbColor},0.25)`);
                    gradient.addColorStop(1, `rgba(${rgbColor},0)`);
                    return gradient;
                },
                tension: 0.3,
            },
            {
                label: "HODL Baseline",
                data: hodlData,
                borderColor: "rgba(148,163,184,0.7)",
                borderWidth: 2,
                borderDash: [8, 4],
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#94a3b8",
                pointHoverBorderWidth: 2,
                fill: false,
                tension: 0.3,
            },
        ],
    }), [labels, strategyData, hodlData, color, chartMetric]);

    const options: ChartOptions<"line"> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(255,255,255,0.95)",
                titleColor: "#64748b",
                bodyColor: "#1e293b",
                borderColor: "rgba(0,0,0,0.06)",
                borderWidth: 1,
                cornerRadius: 12,
                padding: 14,
                titleFont: { size: 10, weight: "bold" as const },
                bodyFont: { size: 13, weight: "bold" as const },
                displayColors: true,
                boxWidth: 10,
                boxHeight: 10,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                    title: (items: TooltipItem<"line">[]) => {
                        const idx = items[0]?.dataIndex;
                        if (idx == null || !ts[idx]) return "";
                        return format(new Date(ts[idx].date), "MMM dd, yyyy");
                    },
                    label: (item: TooltipItem<"line">) => {
                        const val = item.parsed.y ?? 0;
                        if (chartMetric === "value" || chartMetric === "profit" || chartMetric === "rewards") {
                            return ` ${item.dataset.label}: $${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
                        }
                        return ` ${item.dataset.label}: ${val.toFixed(2)}%`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 10, weight: "bold" as const },
                    maxRotation: 0,
                    maxTicksLimit: 8,
                },
            },
            y: {
                grid: {
                    color: "rgba(0,0,0,0.03)",
                },
                border: { display: false },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 10, weight: "bold" as const },
                    callback: (value: string | number) => {
                        const num = typeof value === "string" ? parseFloat(value) : value;
                        if (chartMetric === "value" || chartMetric === "profit" || chartMetric === "rewards") {
                            return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
                        }
                        return `${num.toFixed(1)}%`;
                    },
                },
            },
        },
    }), [chartMetric, ts]);

    const getSubtitleText = () => {
        switch (chartMetric) {
            case "value": return "value ($)";
            case "profit": return "net profit ($)";
            case "return": return "cumulative return (%)";
            case "yield": return "daily yield (%)";
            case "rewards": return "unclaimed rewards ($)";
            default: return "performance";
        }
    };

    return (
        <div className="clay-card rounded-clay-lg p-5 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-black font-display text-slate-800">Portfolio Performance</h3>
                    <p className="text-sm font-bold text-slate-400">
                        Simulated strategy {getSubtitleText()} over {simulationResult.summary.durationDays} days against a static 3.5% HODL baseline
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 clay-inset p-1.5 rounded-2xl w-full xl:w-auto">
                    {[
                        { id: "value", label: "Value ($)" },
                        { id: "profit", label: "Profit ($)" },
                        { id: "return", label: "Return (%)" },
                        { id: "yield", label: "Yield (%)" },
                        { id: "rewards", label: "Rewards ($)" }
                    ].map((metric) => (
                        <button
                            key={metric.id}
                            onClick={() => setChartMetric(metric.id as ChartMetricType)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex-grow sm:flex-grow-0 text-center ${
                                chartMetric === metric.id 
                                    ? 'bg-white shadow-sm text-primary' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {metric.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative w-full h-[360px] clay-inset rounded-[3rem] p-4 md:p-6 overflow-hidden">
                <Line ref={chartRef} data={chartData} options={options} />

                <div className="absolute bottom-6 right-10 flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shadow-sm transition-colors" style={{ backgroundColor: color }}></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Simulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400/70 shadow-sm border border-slate-300"></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HODL Baseline</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
