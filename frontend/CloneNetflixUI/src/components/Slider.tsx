// src/components/SimpleHeroSlider.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface SliderItem {               // ← перейменував для ясності
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    overview?: string;
    media_type?: "movie" | "tv";    // ← додаємо це поле (опціональне)
}

interface SimpleHeroSliderProps {
    movies: SliderItem[];           // можна залишити назву пропса movies або змінити на items
    sectionTitle?: string;          // опціонально — для заголовка секції
}

const SimpleHeroSlider: React.FC<SimpleHeroSliderProps> = ({ movies, sectionTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = movies.slice(0, 20);

    const TMDB_IMG_BASE = import.meta.env.VITE_TMDB_IMG_BASE;

    const getVisibleCards = () => {
        if (typeof window === "undefined") return 5;
        if (window.innerWidth >= 1536) return 6;
        if (window.innerWidth >= 1280) return 5;
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    };

    const [visibleCards, setVisibleCards] = useState(getVisibleCards());

    useEffect(() => {
        const handleResize = () => setVisibleCards(getVisibleCards());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (slides.length <= visibleCards) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (slides.length - visibleCards + 1));
        }, 8000);

        return () => clearInterval(interval);
    }, [slides.length, visibleCards]);

    const next = () => {
        setCurrentIndex((prev) =>
            prev >= slides.length - visibleCards ? 0 : prev + 1
        );
    };

    const prev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? slides.length - visibleCards : prev - 1
        );
    };

    if (slides.length === 0) return null;

    return (
        <section>
            {sectionTitle && (
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 px-2">
                    {sectionTitle}
                </h2>
            )}

            <div className="relative group">
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 hover:bg-gray-900 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 hover:bg-gray-900 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                        }}
                    >
                        {slides.map((item) => (
                            <div
                                key={item.id}
                                className="flex-shrink-0 px-3"
                                style={{ width: `${100 / visibleCards}%` }}
                            >
                                <Link
                                    to={`/details/${item.media_type || "movie"}/${item.id}`}
                                    className="block group/item relative overflow-hidden rounded-2xl"
                                >
                                    {item.poster_path ? (
                                        <img
                                            src={`${TMDB_IMG_BASE}${item.poster_path}`}
                                            alt={item.title || item.name}
                                            className="w-full h-[220px] md:h-[320px] object-cover object-center transition-transform duration-500 group-hover/item:scale-110"
                                            loading="lazy"
                                            style={{ aspectRatio: '2/3', minHeight: 220, maxHeight: 320 }}
                                        />
                                    ) : (
                                        <div className="w-full h-[220px] md:h-[320px] bg-gray-700 flex items-center justify-center" style={{ aspectRatio: '2/3', minHeight: 220, maxHeight: 320 }}>
                                            <span className="text-gray-500">Постер відсутній</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                            {item.title || item.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-300 text-sm">
                                                {(item.release_date || item.first_air_date || "").slice(0, 4) || "Невідомо"}
                                            </p>
                                            {item.vote_average > 0 && (
                                                <p className="text-yellow-400 font-bold flex items-center gap-1">
                                                    ⭐ {item.vote_average.toFixed(1)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 shadow-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {slides.length > visibleCards && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: slides.length - visibleCards + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`transition-all rounded-full ${i === currentIndex
                                    ? "bg-blue-600 w-10 h-2"
                                    : "bg-gray-600 w-2 h-2 hover:bg-gray-400"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SimpleHeroSlider;