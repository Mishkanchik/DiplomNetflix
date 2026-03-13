// @ts-nocheck
// Пошук фільмів за жанром
export const fetchByGenre = async (genreId: number, language: string): Promise<TmdbItem[]> => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const res = await fetch(
        `${TMDB_API_URL}/discover/movie?with_genres=${genreId}&language=${language}&api_key=${apiKey}`
    );
    if (!res.ok) throw new Error(`Genre search failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return data.results;
};
// src/api/tmdbDashboard.ts

const TMDB_API_URL = import.meta.env.VITE_TMDB_API_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const authHeaders = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
};

export interface TmdbItem {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    overview?: string;
    media_type?: "movie" | "tv";
    genre_ids?: number[];
    original_language?: string;
    keyword_ids?: number[];
    backdrop_path?: string | null;
}

export interface TmdbVideo {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
}

interface TmdbPagedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

// ──────────────────────────────────────────────
// Загальні запити (WelcomeDashboard)
// ──────────────────────────────────────────────

export const fetchNowPlaying = async (language: string): Promise<TmdbItem[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/movie/now_playing?language=${language}&page=1`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Now playing failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return data.results;
};

export const fetchPopularMovies = async (language: string): Promise<TmdbItem[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/movie/popular?language=${language}&page=1`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Popular movies failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return data.results;
};

export const fetchPopularTv = async (language: string): Promise<TmdbItem[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/tv/popular?language=${language}&page=1`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Popular TV failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return data.results;
};

export const searchMulti = async (
    query: string,
    language: string,
    page: number = 1
): Promise<TmdbItem[]> => {
    if (!query.trim()) return [];
    const res = await fetch(
        `${TMDB_API_URL}/search/multi?language=${language}&query=${encodeURIComponent(query.trim())}&page=${page}&include_adult=false`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Multi search failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv");
};

export const fetchDashboardInitialData = async (language: string) => {
    try {
        const [nowPlaying, popularMovies, popularTv] = await Promise.all([
            fetchNowPlaying(language),
            fetchPopularMovies(language),
            fetchPopularTv(language),
        ]);
        return { nowPlaying, popularMovies, popularTv };
    } catch (err) {
        console.error("Initial dashboard data failed:", err);
        throw err;
    }
};

// ──────────────────────────────────────────────
// Фільми (DashboardMovies)
// ──────────────────────────────────────────────

export const fetchTopRatedMovies = async (language: string, pages: number = 5): Promise<TmdbItem[]> => {
    const results: TmdbItem[] = [];
    for (let page = 1; page <= pages; page++) {
        const res = await fetch(
            `${TMDB_API_URL}/movie/top_rated?language=${language}&page=${page}`,
            { headers: authHeaders }
        );
        if (!res.ok) throw new Error(`Top rated movies page ${page} failed`);
        const data: TmdbPagedResponse<TmdbItem> = await res.json();
        results.push(...(data.results || []));
    }
    return results;
};

// Нова функція: Новинки для фільмів (ті, що вже вийшли, зараз в прокаті)
export const fetchNewMovies = async (language: string): Promise<TmdbItem[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/movie/now_playing?language=${language}&page=1`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`New movies failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return (data.results || []).map(item => ({ ...item, media_type: "movie" as const }));
};

export const searchMoviesOnly = async (query: string, language: string, page: number = 1): Promise<TmdbItem[]> => {
    if (query.trim().length < 2) return [];
    const res = await fetch(
        `${TMDB_API_URL}/search/movie?language=${language}&query=${encodeURIComponent(query.trim())}&page=${page}`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Movie search failed`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return data.results || [];
};

// ──────────────────────────────────────────────
// Аніме (DashboardAnime)
// ──────────────────────────────────────────────

const ANIME_FILTERS = "with_keywords=210024&with_genres=16&with_original_language=ja&vote_count.gte=50";

export const fetchTopAnime = async (language: string): Promise<TmdbItem[]> => {
    const results: TmdbItem[] = [];
    for (let page = 1; page <= 3; page++) {
        const resMovie = await fetch(
            `${TMDB_API_URL}/discover/movie?language=${language}&sort_by=vote_average.desc&page=${page}&${ANIME_FILTERS}`,
            { headers: authHeaders }
        );
        if (!resMovie.ok) throw new Error(`Anime movies page ${page} failed`);
        const dataMovie = await resMovie.json();
        results.push(...(dataMovie.results || []));
    }
    for (let page = 1; page <= 3; page++) {
        const resTv = await fetch(
            `${TMDB_API_URL}/discover/tv?language=${language}&sort_by=vote_average.desc&page=${page}&${ANIME_FILTERS}`,
            { headers: authHeaders }
        );
        if (!resTv.ok) throw new Error(`Anime TV page ${page} failed`);
        const dataTv = await resTv.json();
        results.push(...(dataTv.results || []));
    }
    return results
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 100)
        .map(item => ({ ...item, media_type: item.first_air_date ? "tv" : "movie" }));
};

// Нова функція: Новинки для аніме (ті, що вже вийшли або виходять, за останній рік)
export const fetchNewAnime = async (language: string): Promise<TmdbItem[]> => {
    const currentDate = new Date().toISOString().split('T')[0];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const pastDate = oneYearAgo.toISOString().split('T')[0];

    const tvFilters = `${ANIME_FILTERS}&sort_by=first_air_date.desc&first_air_date.lte=${currentDate}&first_air_date.gte=${pastDate}`;
    const resTv = await fetch(
        `${TMDB_API_URL}/discover/tv?language=${language}&${tvFilters}&page=1`,
        { headers: authHeaders }
    );
    if (!resTv.ok) throw new Error(`New anime TV failed`);
    const dataTv: TmdbPagedResponse<TmdbItem> = await resTv.json();

    const movieFilters = `${ANIME_FILTERS}&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}&primary_release_date.gte=${pastDate}`;
    const resMovie = await fetch(
        `${TMDB_API_URL}/discover/movie?language=${language}&${movieFilters}&page=1`,
        { headers: authHeaders }
    );
    if (!resMovie.ok) throw new Error(`New anime movies failed`);
    const dataMovie: TmdbPagedResponse<TmdbItem> = await resMovie.json();

    const results = [...dataTv.results, ...dataMovie.results];
    return results
        .sort((a, b) => {
            const dateA = a.first_air_date || a.release_date || '0000-00-00';
            const dateB = b.first_air_date || b.release_date || '0000-00-00';
            return dateB.localeCompare(dateA);
        })
        .slice(0, 20)
        .map(item => {
            // Більш надійне визначення типу
            let mediaType: "movie" | "tv" = "movie";

            if (item.first_air_date) {
                mediaType = "tv";
            } else if (item.release_date) {
                mediaType = "movie";
            } else if (item.genre_ids?.includes(16) && item.original_language === "ja") {

                mediaType = "tv";
            }

            return { ...item, media_type: mediaType };
        });
};

export const searchAnime = async (query: string, language: string, page: number = 1): Promise<TmdbItem[]> => {
    if (query.trim().length < 2) return [];
    const res = await fetch(
        `${TMDB_API_URL}/search/multi?language=${language}&query=${encodeURIComponent(query.trim())}&page=${page}&include_adult=false`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Anime search failed`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return (data.results || [])
        .filter(item => {
            const isKeyword = item.keyword_ids?.includes(210024);
            const isJa = item.original_language === "ja";
            const isAnim = item.genre_ids?.includes(16);
            return (item.media_type === "movie" || item.media_type === "tv") && (isKeyword || (isJa && isAnim));
        })
        .slice(0, 100);
};

// ──────────────────────────────────────────────
// Серіали (DashboardSeries)
// ──────────────────────────────────────────────

export const fetchTopRatedSeries = async (language: string, pages: number = 5): Promise<TmdbItem[]> => {
    const results: TmdbItem[] = [];
    for (let page = 1; page <= pages; page++) {
        const res = await fetch(
            `${TMDB_API_URL}/tv/top_rated?language=${language}&page=${page}`,
            { headers: authHeaders }
        );
        if (!res.ok) throw new Error(`Top rated series page ${page} failed`);
        const data: TmdbPagedResponse<TmdbItem> = await res.json();
        const filtered = (data.results || []).filter(
            item => !(item.genre_ids?.includes(16) && item.original_language === "ja")
        );
        results.push(...filtered);
    }
    return results.slice(0, 100);
};


export const fetchNewSeries = async (language: string): Promise<TmdbItem[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/tv/on_the_air?language=${language}&page=1`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`New series failed: ${res.status}`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return (data.results || [])
        .filter(item => !(item.genre_ids?.includes(16) && item.original_language === "ja"))
        .map(item => ({ ...item, media_type: "tv" as const }));
};


export const searchSeriesOnly = async (query: string, language: string, page: number = 1): Promise<TmdbItem[]> => {
    if (query.trim().length < 2) return [];
    const res = await fetch(
        `${TMDB_API_URL}/search/tv?language=${language}&query=${encodeURIComponent(query.trim())}&page=${page}&include_adult=false`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Series search failed`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return (data.results || [])
        .filter(item => !(item.genre_ids?.includes(16) && item.original_language === "ja"))
        .slice(0, 100);
};

// ──────────────────────────────────────────────
// Мультфільми (DashboardCartoons) — нові функції
// ──────────────────────────────────────────────

const CARTOON_FILTERS = "with_genres=16&vote_count.gte=300&without_keywords=210024";

export const fetchTopCartoons = async (language: string, pages: number = 5): Promise<TmdbItem[]> => {
    const results: TmdbItem[] = [];
    for (let page = 1; page <= pages; page++) {
        const res = await fetch(
            `${TMDB_API_URL}/discover/movie?language=${language}&sort_by=vote_average.desc&${CARTOON_FILTERS}&page=${page}`,
            { headers: authHeaders }
        );
        if (!res.ok) throw new Error(`Top cartoons page ${page} failed`);
        const data: TmdbPagedResponse<TmdbItem> = await res.json();
        const filtered = (data.results || []).filter(item => item.original_language !== "ja");
        results.push(...filtered.map(item => ({ ...item, media_type: "movie" as const })));
    }
    return results
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 100);
};

// Нова функція: Новинки для мультфільмів (ті, що вже вийшли, за останній рік)
export const fetchNewCartoons = async (
    language: string,
    minVoteCount: number = 50,      // легко міняти
    yearsBack: number = 1.5         // легко міняти
): Promise<TmdbItem[]> => {
    const currentDate = new Date().toISOString().split('T')[0];
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - yearsBack);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    const baseFilters = `with_genres=16&without_keywords=210024&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`;

    const filters = minVoteCount > 0
        ? `${baseFilters}&vote_count.gte=${minVoteCount}&primary_release_date.gte=${pastDateStr}`
        : `${baseFilters}&primary_release_date.gte=${pastDateStr}`;

    const allResults: TmdbItem[] = [];
    const pagesToFetch = 6;

    for (let page = 1; page <= pagesToFetch; page++) {
        const res = await fetch(
            `${TMDB_API_URL}/discover/movie?language=${language}&${filters}&page=${page}`,
            { headers: authHeaders }
        );

        if (!res.ok) {
            console.warn(`Cartoons page ${page} failed: ${res.status}`);
            break;
        }

        const data: TmdbPagedResponse<TmdbItem> = await res.json();
        allResults.push(...(data.results || []));
    }

    return allResults
        .filter(item => item.original_language !== "ja")
        .map(item => ({ ...item, media_type: "movie" as const }))
        .sort((a, b) => {
            const dateA = a.release_date || '0000-00-00';
            const dateB = b.release_date || '0000-00-00';
            return dateB.localeCompare(dateA);
        })
        .slice(0, 120);
};

export const searchCartoonsOnly = async (query: string, language: string, page: number = 1): Promise<TmdbItem[]> => {
    if (query.trim().length < 2) return [];
    const res = await fetch(
        `${TMDB_API_URL}/search/movie?language=${language}&query=${encodeURIComponent(query.trim())}&page=${page}&include_adult=false`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Cartoons search failed`);
    const data: TmdbPagedResponse<TmdbItem> = await res.json();
    return (data.results || [])
        .filter(item => {
            const isAnim = item.genre_ids?.includes(16);
            const isNotJa = item.original_language !== "ja";
            return isAnim && isNotJa;
        })
        .slice(0, 100);
};

// ──────────────────────────────────────────────
// Деталі контенту (MovieDetails.tsx)
// ──────────────────────────────────────────────

export const fetchContentDetails = async (
    type: "movie" | "tv",
    id: string,
    language: string
): Promise<any> => {
    const res = await fetch(
        `${TMDB_API_URL}/${type}/${id}?language=${language}`,
        { headers: authHeaders }
    );
    if (!res.ok) throw new Error(`Details fetch failed: ${res.status}`);
    return await res.json();
};

export const fetchContentVideos = async (
    type: "movie" | "tv",
    id: string,
    language: string
): Promise<TmdbVideo[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/${type}/${id}/videos?language=${language}`,
        { headers: authHeaders }
    );
    if (!res.ok) return []; // не кидаємо помилку, просто порожній масив
    const data = await res.json();
    return (data.results || []).filter(
        (v: any) =>
            v.site === "YouTube" &&
            ["Trailer", "Teaser", "Clip"].includes(v.type)
    );
};

export const fetchSimilarContent = async (
    type: "movie" | "tv",
    id: string,
    language: string,
    page: number = 1
): Promise<TmdbItem[]> => {
    const res = await fetch(
        `${TMDB_API_URL}/${type}/${id}/similar?language=${language}&page=${page}`,
        { headers: authHeaders }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).slice(0, 20);
};
