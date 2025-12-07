"use client";

import { useState } from "react";

interface LeverageSliderProps {
    value: number;
    onChange: (leverage: number) => void;
    disabled?: boolean;
}

export default function LeverageSlider({ value, onChange, disabled }: LeverageSliderProps) {
    const leverageOptions = [1, 2, 3, 5, 10];

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Leverage</span>
                <span className={`text-lg font-bold ${value > 5 ? 'text-red-400' : value > 1 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {value}x
                </span>
            </div>

            <div className="flex gap-1">
                {leverageOptions.map((lev) => (
                    <button
                        key={lev}
                        onClick={() => onChange(lev)}
                        disabled={disabled}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${value === lev
                                ? lev > 5
                                    ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                    : lev > 1
                                        ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                                        : 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {lev}x
                    </button>
                ))}
            </div>

            {value > 5 && (
                <p className="text-xs text-red-400/80 text-center animate-pulse">
                    ⚠️ High risk - Losses magnified {value}x
                </p>
            )}
        </div>
    );
}
