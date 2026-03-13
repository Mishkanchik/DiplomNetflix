// src/layouts/AuthLayout.tsx
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedOutlet from "../components/AnimatedOutlet";
import logo from "/images/shape/logo.png";

export default function AuthLayout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-100 flex flex-col">
      {/* Хедер — адаптивний */}
      <header className="bg-gray-900/70 backdrop-blur-2xl shadow-2xl sticky top-0 z-50 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
          {/* Логотип — менший на мобілках */}
          <Link
            to="/dashboard"

            tabIndex={-1} // Пропускает элемент при нажатии Tab
            className="flex items-center w-48 "
          >
            <img
              src={logo}
              alt="" // Пустой alt скрывает текст при наведении/фокусе
              draggable={false} // Запрещает "вытягивание" картинки
              className="select-none"
            />
          </Link>

          {/* Правий блок — кнопки + перемикач мови */}
          <div className="flex items-center gap-3 sm:gap-6">
            <LanguageSwitcher />

            {/* Посилання "Вхід" — ховається текст на дуже малих екранах */}
            <Link
              to="/login"
              className="text-gray-300 font-medium hover:text-white transition duration-300 text-sm sm:text-base"
            >
              {t('auth.login')}
            </Link>

            {/* Кнопка "Реєстрація" — адаптивна */}
            <Link
              to="/register"
              className="
                px-5 sm:px-8 py-2.5 sm:py-3.5 
                bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-500 hover:to-purple-500 
                rounded-xl sm:rounded-2xl 
                font-bold text-sm sm:text-lg 
                shadow-xl shadow-indigo-900/50 
                transition-all duration-300 
                transform hover:scale-105 active:scale-95
              "
            >
              {t('auth.register')}
            </Link>
          </div>
        </div>
      </header>

      {/* Основний контент — форми логіну/реєстрації */}
      <main className="flex-1">

        <AnimatedOutlet transition="fadeInUp" />

      </main>

      {/* Футер (опціонально, можна прибрати, якщо не потрібен) */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800/50">
        © {new Date().getFullYear()} Nexo Cinema. {t("footer.copyright")}
      </footer>
    </div>
  );
}