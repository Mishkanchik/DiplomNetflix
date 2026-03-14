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

  const getMediaTypeLabel = (item: Item) => {
    if (item.media_type === "movie") return t('landing.movie');
    if (item.media_type === "tv") return t('landing.series');
    return t('landing.movie');
  };

  const renderGrid = (items: Item[], title: string) => (
    <section className="mb-10 sm:mb-16 px-3 sm:px-4 lg:px-0">
      <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {title}
      </h2>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={handleCardClick}
            className="
              group relative overflow-hidden rounded-lg sm:rounded-xl
              shadow-md sm:shadow-xl transition-all duration-300
              hover:scale-[1.04] active:scale-100 hover:shadow-purple-600/40
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black
            "
          >
            {item.poster_path ? (
              <img
                src={`${TMDB_IMG_BASE}${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800/80 flex items-center justify-center text-gray-400 text-xs sm:text-sm font-medium">
                {t('common.poster_missing')}
              </div>
            )}

            {/* Бейджик типу контенту */}
            <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10">
              <span className="
                inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 
                bg-gradient-to-r from-indigo-700/90 to-purple-700/90 
                text-white text-[10px] sm:text-xs font-semibold 
                rounded-full shadow-sm backdrop-blur-sm border border-white/10
              ">
                {getMediaTypeLabel(item)}
              </span>
            </div>

            {/* Оверлей */}
            <div className="
              absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent
              flex flex-col justify-end p-2.5 sm:p-4
              opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight line-clamp-2 mb-1">
                {item.title || item.name}
              </h3>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-300">
                  {(item.release_date || item.first_air_date || "—").slice(0, 4)}
                </span>
                {item.vote_average > 0 && (
                  <span className="text-yellow-400 font-semibold flex items-center gap-1">
                    ★ {item.vote_average.toFixed(1)}
                  </span>
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
      {/* HERO — mobile-first */}
      <div className="relative h-[85vh] sm:h-[100vh] w-full flex items-center justify-center overflow-hidden">
        {!loading && trending.length > 0 && (
          <div className="absolute inset-0 -z-10">
            <SimpleHeroSlider movies={trending} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80" />

        <div className="relative z-20 text-center px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
          <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Nexo
            </span>
            <span className="text-white">Cinema</span>
          </h1>

          <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-200 mb-8 sm:mb-12 max-w-4xl mx-auto font-light drop-shadow-lg leading-relaxed">
            {t('landing.tagline')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 justify-center items-center mb-8 sm:mb-12">
            <Link
              to="/login"
              className="
                px-8 py-3.5 sm:px-10 sm:py-4.5 
                bg-gradient-to-r from-cyan-600 to-purple-700 
                hover:from-cyan-700 hover:to-purple-800 
                rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg 
                shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-98
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
              "
            >
              {t('landing.login')}
            </Link>

            <Link
              to="/register"
              className="
                px-8 py-3.5 sm:px-10 sm:py-4.5 
                bg-white/10 hover:bg-white/20 backdrop-blur-md 
                border border-white/30 rounded-xl sm:rounded-2xl 
                font-bold text-base sm:text-lg 
                transition-all duration-300 transform hover:scale-105 active:scale-98
              "
            >
              {t('landing.register_free')}
            </Link>

            <Link
              to="/about-help"
              className="
                px-8 py-3.5 sm:px-10 sm:py-4.5 
                bg-gradient-to-r from-indigo-500 to-purple-600 
                hover:from-indigo-600 hover:to-purple-700 
                rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg 
                shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-98
              "
            >
              {t('aboutHelp.title')}
            </Link>
          </div>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            {t('landing.features')}
          </p>
        </div>
      </div>

      {/* Основний контент */}
      <div className="relative z-20 -mt-20 sm:-mt-32 pb-12 sm:pb-20 px-3 sm:px-5 lg:px-6">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center py-16 sm:py-32 text-xl sm:text-3xl text-gray-400">
              {t('landing.loading')}
            </div>
          ) : (
            <>
              {renderGrid(popularMovies, t('landing.popular_movies'))}
              {renderGrid(popularSeries, t('landing.top_series'))}
            </>
          )}

          {/* Фінальний CTA */}
          <div className="mt-10 sm:mt-16 py-10 sm:py-16 bg-gradient-to-r from-purple-950/50 via-pink-950/40 to-cyan-950/50 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-md text-center px-5 sm:px-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-5 sm:mb-8 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {t('landing.cta_title')}
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('landing.cta_description')}
            </p>
            <Link
              to="/register"
              className="
                inline-block px-10 sm:px-14 py-4 sm:py-5 
                bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 
                hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 
                rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl 
                shadow-2xl transition-all duration-400 transform hover:scale-105 active:scale-98
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