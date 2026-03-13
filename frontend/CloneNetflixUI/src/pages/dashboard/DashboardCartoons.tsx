// src/pages/DashboardCartoons.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../lib/useFavorites";
import { Heart, Clock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { fetchTopCartoons, searchCartoonsOnly, fetchNewCartoons } from "../../api/tmdbDashboard";
import { useLoading } from "../../lib/useLoading";
import SearchBar from "../../components/SearchBar";
import SimpleHeroSlider from "../../components/Slider";

interface CartoonItem {
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

interface DashboardCartoonsProps {
  selectedGenres: number[];
  selectedRating: number | null;
}

const DashboardCartoons: React.FC<DashboardCartoonsProps> = ({ selectedGenres, selectedRating }) => {
  const { t, getTMDBLanguage } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { withLoading } = useLoading();
  const [newCartoons, setNewCartoons] = useState<CartoonItem[]>([]);
  const [topCartoons, setTopCartoons] = useState<CartoonItem[]>([]);
  const [filteredCartoons, setFilteredCartoons] = useState<CartoonItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CartoonItem[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [watchLaterList, setWatchLaterList] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("watchLaterList") || "[]")
  );

  const language = getTMDBLanguage();

  // Завантаження топ-мультфільмів
  useEffect(() => {
    withLoading(async () => {
      try {
        const results = await fetchTopCartoons(language, 5); // топ-100 (5 сторінок)
        setTopCartoons(results);
        setVisibleCount(20);
      } catch (err) {
        console.error("Помилка завантаження топ-мультфільмів:", err);
        toast.error(t("cartoons.loading_error") || "Помилка завантаження");
      }
    });
  }, [language]);

  // Синхронізація "На потім"
  useEffect(() => {
    const handleStorage = () => {
      setWatchLaterList(JSON.parse(localStorage.getItem("watchLaterList") || "[]"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Фільтрація топ-мультфільмів
  useEffect(() => {
    if (searchMode) return;

    let filtered = topCartoons;

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((item) =>
        item.genre_ids?.some((gid) => selectedGenres.includes(gid))
      );
    }

    if (selectedRating !== null) {
      filtered = filtered.filter((item) => item.vote_average >= selectedRating);
    }

    setFilteredCartoons(filtered);
    setVisibleCount(20);
  }, [selectedGenres, selectedRating, topCartoons, searchMode]);

  // Фільтрація результатів пошуку
  useEffect(() => {
    if (!searchMode) return;

    let filtered = searchResults;

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((item) =>
        item.genre_ids?.some((gid) => selectedGenres.includes(gid))
      );
    }

    if (selectedRating !== null) {
      filtered = filtered.filter((item) => item.vote_average >= selectedRating);
    }

    setFilteredCartoons(filtered);
    setVisibleCount(20);
  }, [selectedGenres, selectedRating, searchResults, searchMode]);

  useEffect(() => {
    withLoading(async () => {
      try {
        const [nowPlaying, top] = await Promise.all([
          fetchNewCartoons(language),
          fetchTopCartoons(language, 8),
        ]);
        setNewCartoons(nowPlaying.slice(0, 15));
        setTopCartoons(top);
        setVisibleCount(20);
      } catch (err) {
        console.error(err);
        toast.error(t("cartoons.loading_error"));
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
        const results = await searchCartoonsOnly(term.trim(), language, 1);
        setSearchResults(results.slice(0, 100));
        setVisibleCount(20);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Помилка пошуку мультфільмів:", err);
        toast.error(t("cartoons.search_error") || "Помилка пошуку");
      }
    });
  };

  const resetToTop = () => {
    setSearchMode(false);
    setSearchTerm("");
    setSearchResults([]);
    setVisibleCount(20);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadMore = () => {
    const source = searchMode ? searchResults : topCartoons;
    const nextCount = Math.min(visibleCount + 20, source.length);
    setVisibleCount(nextCount);
  };

  const renderGrid = () => {
    const items = searchMode ? searchResults : topCartoons;
    const visibleItems = items.slice(0, visibleCount);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {visibleItems.map((item) => {
            const type = "movie"; // мультфільми зазвичай movie
            const isFav = isFavorite(item.id, type);
            const isWatchLater = watchLaterList.some(
              (m) => m.id === item.id && m.type === type
            );

            return (
              <div
                key={item.id}
                className="relative group bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/90 rounded-3xl shadow-2xl p-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-3xl"
              >
                <Link
                  to={`/details/movie/${item.id}`}
                  className="block overflow-hidden rounded-2xl poster-hover relative"
                >
                  <img
                    src={
                      item.poster_path
                        ? `${import.meta.env.VITE_TMDB_IMG_BASE}${item.poster_path}`
                        : "/no-image.png"
                    }
                    className="rounded-2xl w-full h-[340px] md:h-[440px] object-cover object-center transition-transform duration-500 poster-img"
                    alt={item.title || item.name || "Poster"}
                    style={{ aspectRatio: "2/3", minHeight: 220, maxHeight: 320 }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 text-sm">
                        {(item.release_date || "").slice(0, 4) || "Невідомо"}
                      </p>
                      {item.vote_average > 0 && (
                        <p className="text-yellow-400 font-bold flex items-center gap-1">
                          ⭐ {item.vote_average.toFixed(1)}
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
                      id: item.id,
                      mediaType: type,
                      title: item.title || item.name || "",
                      posterPath: item.poster_path,
                      voteAverage: item.vote_average,
                      releaseDate: item.release_date,
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
                    const normalizedType = "movie";

                    const isAlreadyAdded = isWatchLater;

                    let updated;
                    if (isAlreadyAdded) {
                      updated = watchLaterList.filter(
                        (m) => !(m.id === item.id && m.type === normalizedType)
                      );
                      toast.success(t("watchLater.removed") || "Видалено зі списку «На потім»");
                    } else {
                      updated = [...watchLaterList, {
                        id: item.id,
                        type: normalizedType,
                        title: item.title || item.name || "Без назви",
                        posterUrl: item.poster_path
                          ? `${import.meta.env.VITE_TMDB_IMG_BASE}${item.poster_path}`
                          : null,
                        releaseDate: item.release_date || "",
                      }];
                      toast.success(t("watchLater.added") || "Додано до списку «На потім»");
                    }

                    setWatchLaterList(updated);
                    localStorage.setItem("watchLaterList", JSON.stringify(updated));
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
                  title={
                    isWatchLater
                      ? t("watchLater.remove") || "Видалити зі списку на потім"
                      : t("watchLater.add") || "Додати у список на потім"
                  }
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

        {visibleCount < (searchMode ? searchResults.length : topCartoons.length) && (
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

        {!searchMode && newCartoons.length > 0 && (
          <SimpleHeroSlider movies={newCartoons} />
        )}

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
          placeholder={t("cartoons.search_placeholder") || "Пошук мультфільмів..."}
          className="mt-6 mb-10"
        />




        {/* Заголовок */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          {searchMode
            ? `${t("dashboard.search_results")} "${searchTerm}"`
            : t("cartoons.top") || "Топ мультфільмів"}
        </h1>

        {/* Контент */}
        {filteredCartoons.length === 0 && !searchMode ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            {t("cartoons.no_results") || "Нічого не знайдено"}
          </div>
        ) : (
          renderGrid()
        )}
      </main>
    </div>
  );
};

export default DashboardCartoons;