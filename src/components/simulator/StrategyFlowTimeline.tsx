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
    removeStep: (id: string) => void;
    updateStep: (id: string, updates: Partial<StrategyStep>) => void;
    reorderSteps: (steps: StrategyStep[]) => void;
}

const ACTION_ICONS: Record<StrategyAction, string> = {
    'stake': 'account_balance_wallet',
    'unstake': 'logout',
    'compound': 'sync',
    'borrow': 'trending_down',
    'repay': 'keyboard_return',
    'xcm': 'swap_horiz',
    'swap': 'currency_exchange',
    'farm': 'agriculture',
    'withdraw': 'file_download',
};

const ACTION_COLORS: Record<StrategyAction, string> = {
    'stake': 'text-primary bg-primary/10',
    'unstake': 'text-slate-500 bg-slate-100',
    'compound': 'text-violet-500 bg-violet-100',
    'borrow': 'text-amber-500 bg-amber-100',
    'repay': 'text-blue-500 bg-blue-100',
    'xcm': 'text-pink-500 bg-pink-100',
    'swap': 'text-emerald-500 bg-emerald-100',
    'farm': 'text-primary bg-primary/10',
    'withdraw': 'text-rose-500 bg-rose-100',
};

const ACTION_LARGE_COLORS: Record<StrategyAction, { bg: string; text: string; border: string }> = {
    'stake': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
    'unstake': { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' },
    'compound': { bg: 'bg-violet-100', text: 'text-violet-500', border: 'border-violet-200' },
    'borrow': { bg: 'bg-amber-100', text: 'text-amber-500', border: 'border-amber-200' },
    'repay': { bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-200' },
    'xcm': { bg: 'bg-pink-100', text: 'text-pink-500', border: 'border-pink-200' },
    'swap': { bg: 'bg-emerald-100', text: 'text-emerald-500', border: 'border-emerald-200' },
    'farm': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
    'withdraw': { bg: 'bg-rose-100', text: 'text-rose-500', border: 'border-rose-200' },
};

const ACTION_DESCRIPTIONS: Record<StrategyAction, string> = {
    'stake': 'Lock tokens into a protocol to earn staking rewards',
    'unstake': 'Unlock and withdraw your staked tokens',
    'compound': 'Auto-reinvest earned rewards back into the pool (compound interest)',
    'borrow': 'Use staked tokens as collateral to borrow additional assets',
    'repay': 'Pay back borrowed tokens to the lending protocol',
    'xcm': 'Transfer tokens cross-chain via XCM messaging',
    'swap': 'Exchange one token for another on a DEX',
    'farm': 'Provide liquidity to a pool to earn farming rewards',
    'withdraw': 'Remove tokens from a pool or protocol — close position',
};

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
            className={`relative flex items-center gap-6 pl-12 group ${isDragging ? 'scale-[1.02]' : ''}`}
        >
            {/* Timeline Hub */}
            <div className="absolute left-0 size-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center z-10 group-hover:border-primary/30 transition-colors">
                <div className={`size-8 rounded-xl flex items-center justify-center ${ACTION_COLORS[step.action]}`}>
                    <span className="material-symbols-outlined text-lg">{ACTION_ICONS[step.action]}</span>
                </div>
                <div className="absolute -left-8 text-[10px] font-black text-slate-300">
                    {(index + 1).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Step Content */}
            <div className={`flex-1 clay-inset p-4 rounded-2xl flex items-center justify-between group-hover:bg-white transition-all border border-transparent group-hover:border-slate-100 group-hover:shadow-sm ${isDragging ? 'bg-white shadow-lg border-primary/20' : ''}`}>
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
                        onClick={() => removeStep(step.id)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-clay-red hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    <button
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

export default function StrategyFlowTimeline({ steps, addStep, removeStep, updateStep, reorderSteps }: Props) {
    const availableActions: StrategyAction[] = ['stake', 'farm', 'compound', 'borrow', 'repay', 'swap', 'withdraw'];

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
        <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl font-bold">account_tree</span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Strategy Flow Timeline</h3>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {steps.length} / 5 Steps
                </div>
            </div>

            <div className="relative">
                {/* Vertical Line for Timeline */}
                {steps.length > 0 && (
                    <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
                )}

                <div className="space-y-4">
                    {steps.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30 p-6"
                        >
                            <div className="text-center mb-5">
                                <div className="size-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-2xl text-slate-200">add_task</span>
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Build Your Yield Loop</h4>
                                <p className="text-[10px] text-slate-400 font-bold max-w-[280px] mx-auto leading-relaxed">
                                    Click an action to build your yield loop (e.g. Stake &rarr; Borrow &rarr; Compound)
                                </p>
                            </div>
                            {/* Action icon grid for empty state */}
                            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                                {availableActions.map((action) => {
                                    const colors = ACTION_LARGE_COLORS[action];
                                    return (
                                        <motion.button
                                            key={action}
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addStep(action)}
                                            title={ACTION_DESCRIPTIONS[action]}
                                            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all hover:shadow-sm group/action ${colors.bg} ${colors.border}`}
                                        >
                                            <div className={`size-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
                                                <span className="material-symbols-outlined text-xl">{ACTION_ICONS[action]}</span>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-wider ${colors.text}`}>{action}</span>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] font-medium rounded-xl whitespace-nowrap opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg max-w-[200px] text-center leading-relaxed">
                                                {ACTION_DESCRIPTIONS[action]}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={steps.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <AnimatePresence mode="popLayout">
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
                                </AnimatePresence>
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Add Step Buttons — rounded pills */}
                    {steps.length > 0 && steps.length < 5 && (
                        <div className="pl-12 pt-2">
                            <div className="flex gap-2 flex-wrap">
                                {availableActions.map((action) => (
                                    <motion.button
                                        key={action}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addStep(action)}
                                        title={ACTION_DESCRIPTIONS[action]}
                                        className="relative h-10 px-5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2 group/pill"
                                    >
                                        <span className="material-symbols-outlined text-sm">{ACTION_ICONS[action]}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{action}</span>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] font-medium rounded-xl whitespace-nowrap opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg max-w-[220px] text-center leading-relaxed">
                                            {ACTION_DESCRIPTIONS[action]}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] text-primary/70 font-bold leading-relaxed">
                   <span className="material-symbols-outlined text-[12px] align-middle mr-1">info</span>
                   Pro Tip: Drag to reorder steps. Multi-step strategies allow you to simulate complex yield loops (e.g. Stake &rarr; Borrow &rarr; Compound). Hover over actions to see descriptions.
                </p>
            </div>
        </div>
    );
}
