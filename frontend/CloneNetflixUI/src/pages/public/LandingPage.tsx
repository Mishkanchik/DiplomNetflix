// src/pages/LandingPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { $t } from "../../lib/toast";
import SimpleHeroSlider from "../../components/Slider";
import { useLanguage } from "../../contexts/LanguageContext";

const TMDB_API_URL = import.meta.env.VITE_TMDB_API_URL;
const TMDB_IMG_BASE = import.meta.env.VITE_TMDB_IMG_BASE;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface Item {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  media_type: "movie" | "tv";
}

const LandingPage: React.FC = () => {
  const { t, getTMDBLanguage, language } = useLanguage();
  const [trending, setTrending] = useState<Item[]>([]);
  const [popularMovies, setPopularMovies] = useState<Item[]>([]);
  const [popularSeries, setPopularSeries] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  };

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const tmdbLanguage = getTMDBLanguage();
      try {
        const [trendingRes, moviesRes, seriesRes] = await Promise.all([
          fetch(`${TMDB_API_URL}/trending/all/week?language=${tmdbLanguage}`, { headers: authHeaders }),
          fetch(`${TMDB_API_URL}/movie/popular?language=${tmdbLanguage}&page=1`, { headers: authHeaders }),
          fetch(`${TMDB_API_URL}/tv/popular?language=${tmdbLanguage}&page=1`, { headers: authHeaders }),
        ]);

        if (trendingRes.ok) {
          const data = await trendingRes.json();
          setTrending(
            data.results
              .filter((i: any) => i.media_type === "movie" || i.media_type === "tv")
              .slice(0, 12)
              .map((i: any) => ({ ...i, media_type: i.media_type }))
          );
        }

        if (moviesRes.ok) {
          const data = await moviesRes.json();
          setPopularMovies(data.results.slice(0, 10).map((m: any) => ({ ...m, media_type: "movie" })));
        }

        if (seriesRes.ok) {
          const data = await seriesRes.json();
          setPopularSeries(data.results.slice(0, 10).map((s: any) => ({ ...s, media_type: "tv" })));
        }
      } catch (err) {
        console.error("Помилка завантаження контенту на landing:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [language]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    $t.error(t('landing.login_required'), { duration: 5000 });
  };

  // Функція для визначення типу контенту
  const getMediaTypeLabel = (item: Item) => {
    // Якщо є поле media_type — використовуємо його
    if (item.media_type === "movie") return t('landing.movie');
    if (item.media_type === "tv") return t('landing.series');

    // Якщо поля немає — fallback (для безпеки)
    return t('landing.movie'); // або можна додати логіку за секцією
  };

  const renderGrid = (items: Item[], title: string) => (
    <section className="mb-12 sm:mb-20 px-2 sm:px-0">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-6 sm:mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={handleCardClick}
            className="
              group relative overflow-hidden rounded-xl sm:rounded-2xl
              shadow-lg sm:shadow-2xl transition-all duration-500
              hover:scale-105 active:scale-100 hover:shadow-purple-500/30
            "
          >
            {item.poster_path ? (
              <img
                src={`${TMDB_IMG_BASE}${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                {t('common.poster_missing')}
              </div>
            )}

            {/* Тип контенту — бейджик зверху ліворуч */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
              <span className="
                inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 
                bg-gradient-to-r from-indigo-600/90 to-purple-600/90 
                text-white text-xs sm:text-sm font-medium 
                rounded-full shadow-md backdrop-blur-sm border border-white/10
              ">
                {getMediaTypeLabel(item)}
              </span>
            </div>

            {/* Оверлей з інформацією */}
            <div className="
              absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
              flex flex-col justify-end p-3 sm:p-5
              sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300
            ">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2 line-clamp-2">
                {item.title || item.name}
              </h3>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-gray-300 text-xs sm:text-sm">
                  {(item.release_date || item.first_air_date || "").slice(0, 4) || "Невідомо"}
                </p>
                {item.vote_average > 0 && (
                  <p className="text-yellow-400 font-bold text-xs sm:text-sm flex items-center gap-1">
                    ⭐ {item.vote_average.toFixed(1)}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* HERO SECTION — адаптивна */}
      <div className="relative h-[70vh] sm:h-screen w-full flex items-center justify-center overflow-hidden">
        {!loading && trending.length > 0 && (
          <div className="absolute inset-0 -z-10">
            <SimpleHeroSlider movies={trending} />
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 sm:bg-black/50 backdrop-blur-[2px] sm:backdrop-blur-sm" />

        <div className="relative z-20 text-center px-5 sm:px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Nexo
            </span>{" "}
            <span className="text-white">Cinema</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-gray-200 mb-8 sm:mb-12 max-w-4xl mx-auto font-light drop-shadow-lg">
            {t('landing.tagline')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-10">
            <Link
              to="/login"
              className="
                px-8 sm:px-12 py-4 sm:py-5 
                bg-gradient-to-r from-cyan-500 to-purple-600 
                hover:from-cyan-600 hover:to-purple-700 
                rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl 
                shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
              "
            >
              {t('landing.login')}
            </Link>

            <Link
              to="/register"
              className="
                px-8 sm:px-12 py-4 sm:py-5 
                bg-white/10 hover:bg-white/20 backdrop-blur-lg 
                border border-white/30 rounded-xl sm:rounded-2xl 
                font-bold text-lg sm:text-xl 
                transition-all duration-300 transform hover:scale-105 active:scale-95
              "
            >
              {t('landing.register_free')}
            </Link>

            <Link
              to="/about-help"
              className="
                px-8 sm:px-12 py-4 sm:py-5 
                bg-gradient-to-r from-indigo-400 to-purple-500 
                hover:from-indigo-500 hover:to-purple-600 
                rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl 
                shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
              "
            >
              {t('aboutHelp.title')}
            </Link>
          </div>

          <p className="text-gray-400 text-base sm:text-lg">
            {t('landing.features')}
          </p>
        </div>
      </div>

      {/* КОНТЕНТ ПІСЛЯ HERO */}
      <div className="relative z-20 -mt-16 sm:-mt-24 pb-12 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center py-20 sm:py-40 text-2xl sm:text-3xl text-gray-500">
              {t('landing.loading')}
            </div>
          ) : (
            <>
              {renderGrid(popularMovies, t('landing.popular_movies'))}
              {renderGrid(popularSeries, t('landing.top_series'))}
            </>
          )}

          {/* Фінальний CTA */}
          <div className="mt-12 sm:mt-20 py-12 sm:py-20 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-cyan-900/40 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-md text-center px-4 sm:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {t('landing.cta_title')}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-10 max-w-3xl mx-auto">
              {t('landing.cta_description')}
            </p>
            <Link
              to="/register"
              className="
                inline-block px-10 sm:px-14 py-4 sm:py-6 
                bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 
                hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 
                rounded-xl sm:rounded-2xl font-bold text-xl sm:text-2xl 
                shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95
              "
            >
              {t('landing.register_free')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;