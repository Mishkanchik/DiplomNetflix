import { useState, useEffect } from 'react';

export interface FavoriteItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Завантажуємо улюблені при першому завантаженні
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Помилка при завантаженні улюблених:', e);
      }
    }
  }, []);

  // Зберігаємо улюблені в localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    const exists = favorites.some(fav => fav.id === item.id && fav.mediaType === item.mediaType);
    if (!exists) {
      setFavorites([...favorites, item]);
      return true;
    }
    return false;
  };

  const removeFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    setFavorites(favorites.filter(fav => !(fav.id === id && fav.mediaType === mediaType)));
    return true;
  };

  const isFavorite = (id: number, mediaType: 'movie' | 'tv'): boolean => {
    return favorites.some(fav => fav.id === id && fav.mediaType === mediaType);
  };

  const toggleFavorite = (item: FavoriteItem): boolean => {
    if (isFavorite(item.id, item.mediaType)) {
      removeFavorite(item.id, item.mediaType);
      return false;
    } else {
      addFavorite(item);
      return true;
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    return true;
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
};
