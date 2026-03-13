import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

// Статичні жанри (можна замінити на динамічний запит з TMDB пізніше)
const STATIC_GENRES = [
  { id: 28, name: "Бойовик" },
  { id: 12, name: "Пригоди" },
  { id: 16, name: "Анімація" },
  { id: 35, name: "Комедія" },
  { id: 80, name: "Кримінал" },
  { id: 99, name: "Документальний" },
  { id: 18, name: "Драма" },
  { id: 10751, name: "Сімейний" },
  { id: 14, name: "Фентезі" },
  { id: 36, name: "Історія" },
  { id: 27, name: "Жахи" },
  { id: 10402, name: "Музика" },
  { id: 9648, name: "Містика" },
  { id: 10749, name: "Мелодрама" },
  { id: 878, name: "Наукова фантастика" },
  { id: 10770, name: "Телефільм" },
  { id: 53, name: "Трилер" },
  { id: 10752, name: "Військовий" },
  { id: 37, name: "Вестерн" },
];

interface FilterBarProps {
  selectedGenres: number[];
  setSelectedGenres: (genreIds: number[]) => void;
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
  onClear?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenres = [],
  setSelectedGenres,
  selectedRating,
  setSelectedRating,
  onClear,
}) => {
  const { t } = useLanguage();
  const [genres] = useState(STATIC_GENRES);

  const toggleGenre = (id: number) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== id));
    } else {
      setSelectedGenres([...selectedGenres, id]);
    }
  };

  const clearAll = () => {
    setSelectedGenres([]);
    setSelectedRating(null);
    onClear?.();
  };

  const hasFilters = selectedGenres.length > 0 || selectedRating !== null;

  return (
    <div className="flex flex-col gap-6 sm:gap-7 px-1 sm:px-0">
      {/* Жанри – чіпи */}
      <div>
        <label className="block text-sm font-semibold text-indigo-300/90 mb-3 tracking-wide uppercase">
          {t("filter.genres_label") || "Жанри"}
        </label>

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {/* Кнопка "Всі" */}
          <button
            type="button"
            onClick={() => setSelectedGenres([])}
            className={`
              px-4 py-2 text-sm sm:text-xs font-medium rounded-full 
              transition-all duration-200 border touch-manipulation active:scale-95
              ${selectedGenres.length === 0
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/30"
                : "bg-gray-800/70 text-gray-300 border-gray-700 hover:border-indigo-500/60 hover:bg-gray-800"
              }
            `}
          >
            {t("filter.genres_all") || "Всі"}
          </button>

          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`
                  px-4 py-2 text-sm sm:text-xs font-medium rounded-full 
                  transition-all duration-200 border touch-manipulation active:scale-95
                  ${isSelected
                    ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white border-transparent shadow-md shadow-pink-500/40"
                    : "bg-gray-800/60 text-indigo-200/90 border-gray-700/80 hover:bg-indigo-950/50 hover:border-indigo-500/50"
                  }
                `}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Рейтинг */}
      <div>
        <label
          htmlFor="rating-slider"
          className="block text-sm font-semibold text-indigo-300/90 mb-3 tracking-wide uppercase"
        >
          {t("filter.rating_label") || "Мінімальний рейтинг"}
        </label>

        <div className="flex items-center gap-4">
          <input
            id="rating-slider"
            type="range"
            min={0}
            max={10}
            step={1}
            value={selectedRating ?? 0}
            onChange={(e) => setSelectedRating(Number(e.target.value) || null)}
            className={`
              w-full h-2.5 sm:h-2 bg-gradient-to-r from-gray-700 via-indigo-900 to-pink-900 
              rounded-full appearance-none cursor-pointer
              accent-pink-500
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-br from-pink-500 to-indigo-600
              [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/40
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/40
              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-gradient-to-br from-pink-500 to-indigo-600
              [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/40
              transition-all duration-200
            `}
          />

          <span
            className={`
              min-w-[48px] px-3.5 py-2 text-sm font-bold rounded-full text-center
              transition-all duration-300
              ${selectedRating != null && selectedRating > 0
                ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md shadow-pink-500/30"
                : "bg-gray-800/70 text-gray-400 border border-gray-700"
              }
            `}
          >
            {selectedRating ?? "—"}
          </span>
        </div>
      </div>

      {/* Очистити фільтри */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className={`
            mt-3 px-6 py-3 text-sm font-medium 
            bg-gray-800/80 hover:bg-gray-700 active:bg-gray-600
            text-pink-300 hover:text-pink-200
            border border-gray-700/80 hover:border-pink-500/50
            rounded-xl transition-all duration-200 active:scale-95
            w-full sm:w-auto
          `}
        >
          {t("filter.clear") || "Очистити всі фільтри"}
        </button>
      )}
    </div>
  );
};

export default FilterBar;