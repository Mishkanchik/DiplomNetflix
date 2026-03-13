// components/SearchBar.tsx
import { useState, type FormEvent } from "react";

interface SearchBarProps {
    onSearch: (term: string) => void;
    initialValue?: string;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({
    onSearch,
    initialValue = "",
    placeholder = "Пошук фільмів, серіалів, аніме...",
    className = "",
}: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (trimmed) {
            onSearch(trimmed);
        }
    };

    return (
        <div className={`w-full max-w-2xl mx-auto ${className}`}>
            <form onSubmit={handleSubmit} className="relative group">
                <div className="relative">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={placeholder}
                        className={`
              w-full pl-5 pr-14 py-3.5 sm:py-4
              bg-gray-900/70 backdrop-blur-xl
              border border-gray-700/70
              rounded-full
              text-white text-base placeholder-gray-400
              focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
              transition-all duration-300
              shadow-lg shadow-black/40
              group-hover:shadow-indigo-900/20
            `}
                        aria-label="Поле пошуку"
                    />

                    <button
                        type="submit"
                        className={`
              absolute right-2 top-1/2 -translate-y-1/2
              p-2.5 rounded-full
              bg-gradient-to-r from-indigo-600 to-purple-600
              text-white
              hover:from-indigo-500 hover:to-purple-500
              active:scale-95
              transition-all duration-300
              shadow-md hover:shadow-indigo-600/40
              focus:outline-none focus:ring-2 focus:ring-indigo-400/50
            `}
                        aria-label="Шукати"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}