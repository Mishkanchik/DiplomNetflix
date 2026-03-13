// src/pages/dashboard/Favorites.tsx
import React, { useState, useEffect } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../lib/useFavorites";
import { ArrowLeft, Trash2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useLoading } from "../../lib/useLoading";

const TMDB_IMG_BASE = import.meta.env.VITE_TMDB_IMG_BASE;

const Favorites: React.FC = () => {
  const { t } = useLanguage();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { withLoading } = useLoading();

  const [favoritesList, setFavoritesList] = useState<typeof favorites>([]);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);

  useEffect(() => {
    withLoading(async () => {
      setFavoritesList(favorites);
    });
  }, [favorites]);

  const handleRemove = (id: number, mediaType: 'movie' | 'tv') => {
    removeFavorite(id, mediaType);
    toast.success(t('favorites.removed') || "Видалено з улюблених");
  };

    const handleClearAll = () => {
      setShowClearModal(true);
    };

    const handleConfirmClear = async () => {
      setClearing(true);
      await withLoading(async () => {
        clearFavorites();
        toast.success(t('favorites.cleared') || "Список улюблених очищено");
      });
      setClearing(false);
      setShowClearModal(false);
    };

    const handleCancelClear = () => {
      setShowClearModal(false);
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок + кнопка назад */}
          {/* Confirm Clear Modal */}
          <ConfirmModal
            isOpen={showClearModal}
            onClose={handleCancelClear}
            onConfirm={handleConfirmClear}
            title={t('favorites.confirm_clear_title') || 'Очистити улюблені'}
            description={t('favorites.confirm_clear_desc') || 'Ви впевнені, що хочете очистити весь список улюблених?'}
            confirmText={clearing ? (t('favorites.clearing') || 'Очищення...') : (t('favorites.confirm_clear_btn') || 'Очистити')}
            cancelText={t('favorites.cancel') || 'Скасувати'}
          />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-800/60 hover:bg-gray-700/80 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} />
            {t('dashboard.back')}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t('favorites.title')}
          </h1>
        </div>

        {/* Порожній стан */}
        {favoritesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Heart size={96} className="text-gray-600 mb-6 animate-pulse" />
            <p className="text-2xl sm:text-3xl text-gray-400 mb-8">
              {t('favorites.empty') || "У вас ще немає улюблених"}
            </p>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t('dashboard.back') || "Повернутися до рекомендацій"}
            </Link>
          </div>
        ) : (
          <>
            {/* Кількість + очищення */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div className="text-gray-400 text-lg">
                {t('favorites.title')}: <span className="text-indigo-400 font-bold">{favoritesList.length}</span>
              </div>

              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-6 py-3 bg-red-900/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 rounded-xl transition border border-red-800/50"
              >
                <Trash2 size={18} />
                {t('favorites.clear_all') || "Очистити список"}
              </button>
            </div>

            {/* Сітка карток — стиль точно як у DashboardMain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
              {favoritesList.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/90 rounded-3xl shadow-2xl p-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-3xl"
                >
                  <Link
                    to={`/details/${item.mediaType}/${item.id}`}
                    className="block overflow-hidden rounded-2xl poster-hover relative"
                  >
                    <img
                      src={
                        item.posterPath
                          ? `${TMDB_IMG_BASE}${item.posterPath}`
                          : "/no-image.png"
                      }
                      className="rounded-2xl w-full h-[340px] md:h-[440px] object-cover object-center transition-transform duration-500 poster-img"
                      alt={item.title}
                      style={{ aspectRatio: '2/3', minHeight: 220, maxHeight: 320 }}
                      loading="lazy"
                    />

                    {/* Hover overlay для назви, року, рейтингу */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 text-sm">
                          {(item.releaseDate || "").slice(0, 4) || "Невідомо"}
                        </p>
                        {item.voteAverage > 0 && (
                          <p className="text-yellow-400 font-bold flex items-center gap-1">
                            ⭐ {item.voteAverage.toFixed(1)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Smooth shadow on hover */}
                    <div className="absolute inset-0 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Link>

                  {/* Кнопка видалення — СТИЛЬ ТОЧНО ЯК У DASHBOARDMAIN */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.id, item.mediaType);
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
                      from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:via-rose-500 hover:to-red-500 shadow-rose-900/60 active:from-pink-700 active:via-rose-700 active:to-red-700
                    `}
                    title={t('favorites.remove') || "Видалити з улюблених"}
                  >
                    <Heart
                      size={26}
                      className={`
                        transition-all duration-400
                        drop-shadow-md
                        fill-red-100 text-red-100 animate-heartbeat
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;