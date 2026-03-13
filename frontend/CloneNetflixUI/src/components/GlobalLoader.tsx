// src/components/GlobalLoader.tsx
import React from 'react';
import { GradientLoader } from './Loader'; // або твій шлях до лоадера

// ──────────────────────────────────────────────
// Проста версія з useState + Context (без зовнішніх бібліотек)
// ──────────────────────────────────────────────

interface LoaderContextType {
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = React.createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
    const context = React.useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within LoaderProvider');
    }
    return context;
};

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = React.useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
            {children}
            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
                    <GradientLoader /> {/* без тексту, як ти просив */}
                </div>
            )}
        </LoaderContext.Provider>
    );
};