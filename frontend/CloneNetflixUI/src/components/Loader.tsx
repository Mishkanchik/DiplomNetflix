// src/components/ui/GradientLoader.tsx
import React from 'react';

interface GradientLoaderProps {
    text?: string;
    fullScreen?: boolean;
}

export const GradientLoader: React.FC<GradientLoaderProps> = ({
    text = 'Завантаження...',
    fullScreen = false,
}) => {
    const container = fullScreen
        ? 'fixed inset-0 bg-black flex items-center justify-center z-50'
        : 'flex items-center justify-center py-20';

    return (
        <div className={container}>
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-20 h-20">
                    {/* Пульсуюче сяйво (фоновий glow) */}
                    <div
                        className="
                            absolute inset-0 
                            rounded-full 
                            bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 
                            animate-pulse
                            blur-md
                        "
                        style={{ animationDuration: '3s', animationTimingFunction: 'ease-in-out' }}
                    />

                    {/* Основне кільце з прогресом (конічний градієнт + обертання) */}
                    <div className="relative w-full h-full">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                className="text-gray-800"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="transparent"
                                r="44"
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className="origin-center animate-[spin_2.8s_linear_infinite]"
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="url(#gradient)"
                                fill="transparent"
                                r="44"
                                cx="50"
                                cy="50"
                                strokeDasharray="276"           // ≈ 2 * π * 44
                                strokeDashoffset="69"          // ~25% visible спочатку
                                style={{
                                    animation: 'dash 2.8s linear infinite, spin 2.8s linear infinite',
                                }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#a78bfa" />    {/* indigo */}
                                    <stop offset="50%" stopColor="#c084fc" />   {/* purple */}
                                    <stop offset="100%" stopColor="#f472b6" />  {/* pink */}
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Додатковий тонкий пульсуючий обідок для виразності */}
                        <div
                            className="
                                absolute inset-[-2px] 
                                rounded-full 
                                border-2 border-transparent 
                                bg-gradient-to-r from-indigo-400/40 via-purple-400/30 to-pink-400/20 
                                animate-pulse 
                                blur-sm
                            "
                            style={{ animationDuration: '2.2s' }}
                        />
                    </div>
                </div>

                {/* Текст — мінімальний, з легким градієнтом */}
                <div
                    className="
                        text-transparent bg-clip-text 
                        bg-gradient-to-r from-indigo-200 to-purple-200 
                        font-medium text-lg tracking-wide 
                        opacity-90
                    "
                >
                    {text}
                </div>
            </div>
        </div>
    );
};