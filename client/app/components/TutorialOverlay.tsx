"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, ArrowRight, TrendingUp, DollarSign, Trophy } from "lucide-react";

interface TutorialOverlayProps {
    onComplete: () => void;
}

export default function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        // Check if user has seen tutorial
        const hasSeen = localStorage.getItem("hasSeenTutorial");
        if (!hasSeen) {
            setIsOpen(true);
        } else {
            // If seen, just complete immediately to be safe, though parent shouldn't render if we handle logic there.
            // But for safety:
            onComplete();
        }
    }, [onComplete]);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        localStorage.setItem("hasSeenTutorial", "true");
        setIsOpen(false);
        setTimeout(onComplete, 300); // Wait for animation
    };

    const steps = [
        {
            title: "Welcome to StockGuessr",
            description: "You have $100,000 in virtual cash. Your goal is to beat the market by trading on real historical charts.",
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-500/20"
        },
        {
            title: "How to Trade",
            description: "Analyze the chart and news. BUY to go long if you think price will rise. SELL to close your position or go SHORT if you think it will fall.",
            icon: TrendingUp,
            color: "text-blue-400",
            bg: "bg-blue-500/20"
        },
        {
            title: "Win the Match",
            description: "You have 4 weeks. Each week reveals new price action and headlines. The player with the highest portfolio value at the end wins!",
            icon: Trophy,
            color: "text-yellow-400",
            bg: "bg-yellow-500/20"
        }
    ];

    const currentStep = steps[step - 1];
    const Icon = currentStep.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#111] border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className={`absolute top-0 right-0 w-64 h-64 ${currentStep.bg} rounded-full blur-3xl -z-10 transition-colors duration-500`} />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="flex flex-col items-center text-center mt-4">
                            <motion.div
                                key={step}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className={`w-20 h-20 rounded-2xl ${currentStep.bg} flex items-center justify-center mb-6`}
                            >
                                <Icon size={40} className={currentStep.color} />
                            </motion.div>

                            <motion.h2
                                key={`t-${step}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold text-white mb-3"
                            >
                                {currentStep.title}
                            </motion.h2>

                            <motion.p
                                key={`d-${step}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400 mb-8 min-h-[80px]"
                            >
                                {currentStep.description}
                            </motion.p>

                            {/* Progress and Button */}
                            <div className="w-full flex items-center justify-between mt-auto">
                                <div className="flex gap-2">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-purple-500" : "w-1.5 bg-white/20"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition flex items-center gap-2"
                                >
                                    {step === 3 ? "Start Playing" : "Next"}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
