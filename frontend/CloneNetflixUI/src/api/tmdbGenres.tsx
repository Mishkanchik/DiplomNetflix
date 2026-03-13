// src/api/tmdbGenres.tsx
import axios from "axios";

export async function fetchGenres(language: string): Promise<{ id: number; name: string }[]> {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language,
      },
    });
    return res.data.genres;
  } catch (err) {
    return [];
  }
}
