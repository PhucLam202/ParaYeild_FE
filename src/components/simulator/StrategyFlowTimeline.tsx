"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { StrategyStep, StrategyAction } from "@/types/simulator";

interface Props {
    steps: StrategyStep[];
    addStep: (action: StrategyAction) => void;
    applyPreset: (steps: Array<{ action: StrategyAction; percentage: number }>) => void;
    clearSteps: () => void;
    removeStep: (id: string) => void;
    updateStep: (id: string, updates: Partial<StrategyStep>) => void;
    reorderSteps: (steps: StrategyStep[]) => void;
}

const ACTION_ICONS: Record<StrategyAction, string> = {
    stake: "account_balance_wallet",
    unstake: "logout",
    compound: "sync",
    borrow: "trending_down",
    repay: "keyboard_return",
    xcm: "swap_horiz",
    swap: "currency_exchange",
    farm: "agriculture",
    withdraw: "file_download",
};

const ACTION_COLORS: Record<StrategyAction, string> = {
    stake: "text-primary bg-primary/10",
    unstake: "text-slate-500 bg-slate-100",
    compound: "text-violet-500 bg-violet-100",
    borrow: "text-amber-500 bg-amber-100",
    repay: "text-blue-500 bg-blue-100",
    xcm: "text-pink-500 bg-pink-100",
    swap: "text-emerald-500 bg-emerald-100",
    farm: "text-primary bg-primary/10",
    withdraw: "text-rose-500 bg-rose-100",
};

const ACTION_DESCRIPTIONS: Record<StrategyAction, string> = {
    stake: "Lock tokens into a protocol to start earning yield",
    unstake: "Exit a staked position",
    compound: "Reinvest rewards back into the strategy",
    borrow: "Use the position as collateral",
    repay: "Repay debt to unwind leverage",
    xcm: "Move assets cross-chain with XCM",
    swap: "Exchange assets on a DEX",
    farm: "Provide liquidity or join a farm",
    withdraw: "Remove funds from the protocol",
};

const STRATEGY_PRESETS = [
    {
        label: "Basic Loop",
        summary: "Stake -> Farm -> Compound",
        description: "Fast default for a standard yield loop.",
        steps: [
            { action: "stake" as const, percentage: 40 },
            { action: "farm" as const, percentage: 30 },
            { action: "compound" as const, percentage: 30 },
        ],
    },
    {
        label: "Advanced Loop",
        summary: "Stake -> Borrow -> Farm -> Compound -> Repay",
        description: "Leveraged loop with a repayment step baked in.",
        steps: [
            { action: "stake" as const, percentage: 25 },
            { action: "borrow" as const, percentage: 20 },
            { action: "farm" as const, percentage: 20 },
            { action: "compound" as const, percentage: 20 },
            { action: "repay" as const, percentage: 15 },
        ],
    },
];

function SortableStep({
    step,
    index,
    stepsLength,
    removeStep,
    updateStep,
}: {
    step: StrategyStep;
    index: number;
    stepsLength: number;
    removeStep: (id: string) => void;
    updateStep: (id: string, updates: Partial<StrategyStep>) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative flex items-center gap-6 pl-12 group ${isDragging ? "scale-[1.02]" : ""}`}
        >
            <div className="absolute left-0 size-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center z-10 group-hover:border-primary/30 transition-colors">
                <div className={`size-8 rounded-xl flex items-center justify-center ${ACTION_COLORS[step.action]}`}>
                    <span className="material-symbols-outlined text-lg">{ACTION_ICONS[step.action]}</span>
                </div>
                <div className="absolute -left-8 text-[10px] font-black text-slate-300">
                    {(index + 1).toString().padStart(2, "0")}
                </div>
            </div>

            <div className={`flex-1 clay-inset p-4 rounded-2xl flex items-center justify-between group-hover:bg-white transition-all border border-transparent group-hover:border-slate-100 group-hover:shadow-sm ${isDragging ? "bg-white shadow-lg border-primary/20" : ""}`}>
                <div className="flex flex-col min-w-[140px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{step.action}</span>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-sm font-black text-slate-800 outline-none w-16 focus:ring-4 ring-primary/5 focus:border-primary/20 transition-all text-center"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={step.percentage}
                                    onChange={(e) => updateStep(step.id, { percentage: Math.min(100, Math.max(0, Number(e.target.value))) })}
                                />
                                <span className="absolute -right-1.5 -top-1 size-4 bg-primary/10 rounded-full flex items-center justify-center text-[8px] font-black text-primary border border-primary/20">%</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Capital Allocation</span>
                        </div>
                        <div className="px-1">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={step.percentage}
                                onChange={(e) => updateStep(step.id, { percentage: Number(e.target.value) })}
                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm focus:outline-none"
                                style={{ background: `linear-gradient(to right, #4CAF50 ${step.percentage}%, #F1F5F9 ${step.percentage}%)` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-clay-red hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    <button
                        type="button"
                        className="size-8 rounded-lg flex items-center justify-center text-slate-200 hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
                        {...listeners}
                        {...attributes}
                    >
                        <span className="material-symbols-outlined">drag_indicator</span>
                    </button>
                </div>
            </div>

            {index < stepsLength - 1 && (
                <div className="absolute left-[20px] bottom-[-20px] material-symbols-outlined text-slate-200 text-sm rotate-90">
                    double_arrow
                </div>
            )}
        </div>
    );
}

export default function StrategyFlowTimeline({
    steps,
    addStep,
    applyPreset,
    clearSteps,
    removeStep,
    updateStep,
    reorderSteps,
}: Props) {
    const availableActions: StrategyAction[] = ["stake", "farm", "compound", "borrow", "repay", "swap", "withdraw"];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = steps.findIndex((s) => s.id === active.id);
            const newIndex = steps.findIndex((s) => s.id === over.id);
            reorderSteps(arrayMove(steps, oldIndex, newIndex));
        }
    }

    return (
        <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl font-bold">account_tree</span>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Strategy Flow Timeline</h3>
                        <p className="text-xs text-slate-400 font-bold">Quick Start: Basic Loop or Advanced Loop, then tweak only if needed.</p>
                    </div>
                </div>
                {steps.length > 0 && (
                    <button
                        type="button"
                        onClick={clearSteps}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors hover:border-red-200 hover:text-red-500"
                    >
                        Clear Flow
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {STRATEGY_PRESETS.map((preset) => (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(preset.steps)}
                        className="rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    {preset.label}
                                </span>
                                <p className="mt-3 text-base font-black text-slate-800">{preset.summary}</p>
                                <p className="mt-1 text-sm text-slate-500 font-medium">{preset.description}</p>
                            </div>
                            <span className="material-symbols-outlined text-primary">keyboard_double_arrow_right</span>
                        </div>
                    </button>
                ))}
            </div>

            {steps.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Need a custom flow?</h4>
                    <p className="mt-2 text-sm text-slate-500 font-medium max-w-xl mx-auto">
                        Build it manually only if the preset loops do not match your strategy.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {availableActions.map((action) => (
                            <button
                                key={action}
                                type="button"
                                onClick={() => addStep(action)}
                                title={ACTION_DESCRIPTIONS[action]}
                                className="h-10 px-4 rounded-full bg-white border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">{ACTION_ICONS[action]}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{action}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-primary/80 font-bold">
                            {steps.length} active step{steps.length > 1 ? "s" : ""}. Drag to reorder or replace the whole flow with another preset above.
                        </p>
                        <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Active
                        </span>
                    </div>

                    <div className="relative">
                        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={steps.map((step) => step.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <AnimatePresence mode="popLayout">
                                    <div className="space-y-4">
                                        {steps.map((step, index) => (
                                            <motion.div
                                                key={step.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                            >
                                                <SortableStep
                                                    step={step}
                                                    index={index}
                                                    stepsLength={steps.length}
                                                    removeStep={removeStep}
                                                    updateStep={updateStep}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </AnimatePresence>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {steps.length < 5 && (
                        <div className="pl-12 pt-2">
                            <div className="flex gap-2 flex-wrap">
                                {availableActions.map((action) => (
                                    <button
                                        key={action}
                                        type="button"
                                        onClick={() => addStep(action)}
                                        title={ACTION_DESCRIPTIONS[action]}
                                        className="relative h-10 px-5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">{ACTION_ICONS[action]}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{action}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mx-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[11px] text-primary/70 font-bold leading-relaxed">
                    Use presets for the common loop paths. The manual builder is still here for edge cases, but it no longer dominates the first screen.
                </p>
            </div>
        </div>
    );
}
