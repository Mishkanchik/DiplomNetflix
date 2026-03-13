// src/pages/DashboardMovies.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../lib/useFavorites";
import { Heart, Clock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { fetchTopRatedMovies, searchMoviesOnly, fetchNewMovies } from "../../api/tmdbDashboard";
import { useLoading } from "../../lib/useLoading";
import SearchBar from "../../components/SearchBar";
import SimpleHeroSlider from "../../components/Slider";


interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  genre_ids?: number[];
}

const WATCH_LATER_KEY = "watchLaterList";

interface DashboardMoviesProps {
  selectedGenres: number[];
  selectedRating: number | null;
}

const DashboardMovies: React.FC<DashboardMoviesProps> = ({ selectedGenres, selectedRating }) => {
  const { t, getTMDBLanguage } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { withLoading } = useLoading();
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [watchLaterList, setWatchLaterList] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem(WATCH_LATER_KEY) || "[]")
  );

  const language = getTMDBLanguage();

  // Завантаження топ-фільмів
  useEffect(() => {
    withLoading(async () => {
      try {
        const results = await fetchTopRatedMovies(language, 5); // топ-100 (5 сторінок по 20)
        setTopMovies(results);
        setDisplayMovies(results.slice(0, 20));
        setVisibleCount(20);
      } catch (err) {
        console.error("Помилка завантаження топ-фільмів:", err);
        toast.error(t("movies.loading_error") || "Помилка завантаження");
      }
    });
  }, [language]);

  // Синхронізація списку "На потім"
  useEffect(() => {
    const handleStorage = () => {
      setWatchLaterList(JSON.parse(localStorage.getItem(WATCH_LATER_KEY) || "[]"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Фільтрація за жанрами/рейтингом (локальна)
  useEffect(() => {
    let filtered = topMovies;

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((m) =>
        m.genre_ids?.some((gid) => selectedGenres.includes(gid))
      );
    }

    if (selectedRating !== null) {
      filtered = filtered.filter((m) => m.vote_average >= selectedRating);
    }

    setDisplayMovies(filtered.slice(0, visibleCount));
  }, [selectedGenres, selectedRating, topMovies, visibleCount]);

  useEffect(() => {
    withLoading(async () => {
      try {
        const [nowPlaying, topRated] = await Promise.all([
          fetchNewMovies(language),
          fetchTopRatedMovies(language, 5),
        ]);
        setNewMovies(nowPlaying.slice(0, 10));
        setTopMovies(topRated);
        setVisibleCount(20);
      } catch (err) {
        console.error(err);
      }
    });
  }, [language]);

  // Пошук
  const searchContent = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchMode(false);
      setSearchResults([]);
      return;
    }

    await withLoading(async () => {
      try {
        setSearchMode(true);
        const results = await searchMoviesOnly(term.trim(), language, 1);
        setSearchResults(results.slice(0, 100)); // ліміт 100
        setDisplayMovies(results.slice(0, 20));
        setVisibleCount(20);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Помилка пошуку:", err);
        toast.error(t("movies.search_error") || "Помилка пошуку");
      }
    });
  };

  const resetToTop = () => {
    setSearchMode(false);
    setSearchTerm("");
    setSearchResults([]);
    setDisplayMovies(topMovies.slice(0, 20));
    setVisibleCount(20);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadMore = () => {
    const nextCount = Math.min(visibleCount + 20, (searchMode ? searchResults : topMovies).length);
    setVisibleCount(nextCount);
    setDisplayMovies((searchMode ? searchResults : topMovies).slice(0, nextCount));
  };

  const renderGrid = () => {
    const items = searchMode ? searchResults : topMovies;
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.slice(0, visibleCount).map((movie) => {
            const type = movie.media_type || "movie";
            const isFav = isFavorite(movie.id, type);
            const isWatchLater = watchLaterList.some((m: any) => m.id === movie.id);

            return (
              <div
                key={movie.id}
                className="relative group bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/90 rounded-3xl shadow-2xl p-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-3xl"
              >
                <Link
                  to={`/details/${type}/${movie.id}`}
                  className="block overflow-hidden rounded-2xl poster-hover relative"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `${import.meta.env.VITE_TMDB_IMG_BASE}${movie.poster_path}`
                        : "/no-image.png"
                    }
                    className="rounded-2xl w-full h-[340px] md:h-[440px] object-cover object-center transition-transform duration-500 poster-img"
                    alt={movie.title || movie.name || "Poster"}
                    style={{ aspectRatio: "2/3", minHeight: 220, maxHeight: 320 }}
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
                      {movie.title || movie.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 text-sm">
                        {(movie.release_date || movie.first_air_date || "").slice(0, 4) || "Невідомо"}
                      </p>
                      {movie.vote_average > 0 && (
                        <p className="text-yellow-400 font-bold flex items-center gap-1">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>

                {/* Улюблене */}
                <button
                  onClick={() => {
                    const result = toggleFavorite({
                      id: movie.id,
                      mediaType: type,
                      title: movie.title || movie.name || "",
                      posterPath: movie.poster_path,
                      voteAverage: movie.vote_average,
                      releaseDate: movie.release_date || movie.first_air_date,
                    });
                    toast.success(
                      result
                        ? t("favorites.added") || "Додано до улюблених"
                        : t("favorites.removed") || "Видалено з улюблених"
                    );
                  }}
                  className={`
                    absolute top-4 right-4 z-20
                    p-2.5 rounded-full
                    bg-gradient-to-r from-red-600 via-rose-600 to-pink-600
                    text-white
                    shadow-lg shadow-red-900/40
                    transition-all duration-300
                    hover:scale-110 hover:shadow-xl hover:shadow-rose-700/50
                    active:scale-95 active:from-red-700 active:via-rose-700 active:to-pink-700
                    ${isFav
                      ? "from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:via-rose-500 hover:to-red-500 shadow-rose-900/60"
                      : ""}
                  `}
                  title={isFav ? t("favorites.remove") : t("favorites.add")}
                >
                  <Heart
                    size={26}
                    className={`
                      transition-all duration-400
                      drop-shadow-md
                      ${isFav ? "fill-red-100 text-red-100 animate-heartbeat" : "text-white/90 group-hover:text-white"}
                    `}
                  />
                </button>

                {/* На потім */}
                <button
                  onClick={() => {
                    let updated;
                    if (isWatchLater) {
                      updated = watchLaterList.filter((m: any) => m.id !== movie.id);
                    } else {
                      updated = [...watchLaterList, {
                        id: movie.id,
                        type,
                        title: movie.title || movie.name || "",
                        posterUrl: movie.poster_path ? `${import.meta.env.VITE_TMDB_IMG_BASE}${movie.poster_path}` : undefined,
                        releaseDate: movie.release_date || movie.first_air_date,
                      }];
                    }
                    setWatchLaterList(updated);
                    localStorage.setItem(WATCH_LATER_KEY, JSON.stringify(updated));
                    toast.success(
                      !isWatchLater
                        ? t("watchLater.added") || "Додано до списку «На потім»"
                        : t("watchLater.removed") || "Видалено зі списку «На потім»"
                    );
                  }}
                  className={`
                    absolute top-4 left-4 z-20
                    p-2.5 rounded-full
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                    text-white
                    shadow-lg shadow-indigo-900/40
                    transition-all duration-300
                    hover:scale-110 hover:shadow-xl hover:shadow-indigo-700/50
                    active:scale-95 active:from-blue-700 active:via-indigo-700 active:to-purple-700
                    ${isWatchLater
                      ? "from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:via-rose-500 hover:to-purple-500 shadow-rose-900/50"
                      : ""}
                  `}
                  title={isWatchLater ? t("watchLater.remove") : t("watchLater.add")}
                >
                  <Clock
                    size={26}
                    className={`
                      transition-all duration-300
                      ${isWatchLater
                        ? "text-pink-100 drop-shadow-md animate-pulse-slow"
                        : "text-white/90 group-hover:text-white drop-shadow-md"}
                    `}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {visibleCount < (searchMode ? searchResults.length : topMovies.length) && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t("common.load_more") || "Завантажити ще"}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">

        {!searchMode && newMovies.length > 0 && (
          <SimpleHeroSlider movies={newMovies} />
        )}

        {/* Кнопка повернення при пошуку */}
        {searchMode && (
          <div className="mb-8 flex items-center">
            <button
              onClick={resetToTop}
              className={`
                group flex items-center gap-2 sm:gap-3
                px-4 sm:px-6 py-2.5 sm:py-3
                bg-gradient-to-r from-indigo-600/90 to-purple-600/90
                hover:from-indigo-500 hover:to-purple-500
                active:from-indigo-700 active:to-purple-700
                text-white font-medium text-sm sm:text-base
                rounded-full shadow-lg shadow-indigo-900/40
                transition-all duration-300
                hover:scale-105 hover:shadow-xl hover:shadow-indigo-700/50
                active:scale-95
                backdrop-blur-sm border border-indigo-500/30
              `}
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              {t("dashboard.back_to_recommendations") || "Повернутися до рекомендацій"}
            </button>
          </div>
        )}
        {/* Пошук */}
        <SearchBar
          onSearch={searchContent}
          initialValue={searchTerm}
          placeholder={t("movies.search_placeholder") || "Пошук фільмів..."}
          className="mt-6 mb-10"
        />



        {/* Заголовок */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          {searchMode
            ? `${t("dashboard.search_results")} "${searchTerm}"`
            : t("movies.top_rated") || "Топ фільмів"}
        </h1>

        {/* Контент */}
        {displayMovies.length === 0 && !searchMode ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            {t("movies.no_results") || "Нічого не знайдено"}
          </div>
        ) : (
          renderGrid()
        )}
      </main>
    </div>
  );
};

export default DashboardMovies;