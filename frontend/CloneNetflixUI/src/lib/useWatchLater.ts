import { useState, useEffect } from 'react';

export interface WatchLaterItem {
    id: number | string;
    type: 'movie' | 'tv';
    title: string;
    posterUrl: string | null;
    releaseDate?: string | null;
}

const LOCAL_STORAGE_KEY = "watchLaterList";

export const useWatchLater = () => {
    const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                setWatchLater(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load watch later list:', e);
            }
        }
    }, []);

    // Save to localStorage whenever watchLater changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchLater));
    }, [watchLater]);

    const addToWatchLater = (item: WatchLaterItem) => {
        const exists = watchLater.some(i => i.id === item.id && i.type === item.type);
        if (!exists) {
            setWatchLater([...watchLater, item]);
            return true;
        }
        return false;
    };

    const removeFromWatchLater = (id: number | string, type: 'movie' | 'tv') => {
        setWatchLater(watchLater.filter(i => !(i.id === id && i.type === type)));
        return true;
    };

    const isInWatchLater = (id: number | string, type: 'movie' | 'tv'): boolean => {
        return watchLater.some(i => i.id === id && i.type === type);
    };

    const toggleWatchLater = (item: WatchLaterItem): boolean => {
        if (isInWatchLater(item.id, item.type)) {
            removeFromWatchLater(item.id, item.type);
            return false;
        } else {
            addToWatchLater(item);
            return true;
        }
    };

    const clearWatchLater = () => {
        setWatchLater([]);
        return true;
    };

    return {
        watchLater,
        addToWatchLater,
        removeFromWatchLater,
        isInWatchLater,
        toggleWatchLater,
        clearWatchLater,
    };
};
