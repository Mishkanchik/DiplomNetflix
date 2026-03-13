import { useState, useEffect } from "react";

export interface WatchHistoryItem {
  id: number | string;
  type: "movie" | "tv" | "series" | "cartoon" | string;
  poster_path?: string | null;
  watchedAt: number;
  releaseDate?: string;
}

const STORAGE_KEY = "watch_history";

export function useWatchHistory() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as WatchHistoryItem[];
      setItems(parsed);
    } catch (e) {
      console.error("Failed to parse watch history", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToHistory = (item: Omit<WatchHistoryItem, "watchedAt">) => {
    setItems((prev) => {
      // deduplicate by id+type
      const key = `${item.type}:${item.id}`;
      const filtered = prev.filter((i) => `${i.type}:${i.id}` !== key);
      const next = [{ ...item, watchedAt: Date.now() }, ...filtered];
      // limit to 200 items
      return next.slice(0, 200);
    });
  };

  const clearHistory = () => setItems([]);

  const removeItem = (id: number | string, type: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  return { items, addToHistory, clearHistory, removeItem };
}
