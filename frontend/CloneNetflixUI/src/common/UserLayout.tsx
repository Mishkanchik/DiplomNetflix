// src/layouts/UserLayout.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  LogOut,
  User,
  CreditCard,
  ArrowUp,
  Heart,
  Clock,
  Menu,
  X,
  Film,
  Tv,
  Clapperboard,
  Baby,
  LayoutDashboard,
  ShieldCheck,
  History,
} from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedOutlet from "../components/AnimatedOutlet";
import logo from "/images/shape/logo.png";
import FilterBar from "../components/FilterBar";

interface UserLayoutProps {
  selectedGenres: number[];
  setSelectedGenres: (genreIds: number[]) => void;
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
}

const UserLayout: React.FC<UserLayoutProps> = ({
  selectedGenres,
  setSelectedGenres,
  selectedRating,
  setSelectedRating,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [user, setUser] = useState<{ name: string; avatarUrl: string | null; email: string } | null>(null);
  const [userPlan, setUserPlan] = useState<"basic" | "standard" | "premium" | null>(null);

  // Функція для генерації дефолтної аватарки з ініціалами
  // Функція для генерації дефолтної аватарки з ініціалами
  const getDefaultAvatar = (name: string) => {
    // Беремо перші дві літери або "??"
    const initials = name.trim()
      ? name
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
      : "??";

    // DiceBear — найнадійніший варіант на 2025–2026
    // Стиль: initials (дуже простий і чистий), або avatars/notionists, micah тощо
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      initials
    )}&backgroundColor=6366f1&textColor=ffffff&fontWeight=600&radius=50`;

    // Альтернативні стилі, які теж рекомендую (просто закоментуй/розкоментуй):
    // return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(initials)}&backgroundColor=6366f1`;
    // return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(initials)}&backgroundColor=6366f1`;
    // return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(initials)}&backgroundColor=6366f1`;
  };

  // Функція визначення ролі з JWT
  const getUserRole = () => {
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payloadBase64 = parts[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const roleRaw = payload.role || payload.user?.role || null;
      return roleRaw ? roleRaw.toLowerCase() : null;
    } catch (err) {
      console.warn("Не вдалося розпарсити JWT для ролі:", err);
      return null;
    }
  };

  useEffect(() => {
    const syncData = () => {
      if (!isAuthenticated) {
        setUser(null);
        setUserPlan(null);
        setIsAdmin(false);
        return;
      }

      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          const parsed = JSON.parse(userJson);
          const displayName =
            parsed.userName?.trim() ||
            (parsed.email || "").split("@")[0]?.trim() ||
            "Користувач";

          setUser({
            name: displayName,
            avatarUrl: parsed.avatarUrl || parsed.avatar || null,
            email: parsed.email || "",
          });

          const rawPlan = localStorage.getItem("userPlan");
          setUserPlan(
            rawPlan === "basic" || rawPlan === "standard" || rawPlan === "premium"
              ? rawPlan
              : null
          );
        } catch (err) {
          console.error("Помилка парсингу user", err);
        }
      }

      // Визначаємо isAdmin з токена
      const role = getUserRole();
      setIsAdmin(role === "admin" || role === "administrator");
      console.log("Розпарсена роль з JWT:", role, "isAdmin:", role === "admin");
    };

    syncData();
    window.addEventListener("storage", syncData);
    window.addEventListener("userPlanChanged", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("userPlanChanged", syncData);
    };
  }, [isAuthenticated]);

  const getAvatarSrc = () => {
    if (!user?.avatarUrl || user.avatarUrl.trim() === "") {
      return getDefaultAvatar(user?.name || "Гість");
    }

    let url = user.avatarUrl.trim();

    // Google аватарки — робимо великий розмір
    if (url.includes("googleusercontent.com") || url.includes("lh3.googleusercontent.com")) {
      // Прибираємо старий розмір, якщо є
      url = url.replace(/=s\d+-c?/, '').replace(/-s\d+-c$/, '');

      // Додаємо стабільний розмір
      const separator = url.includes('?') ? '&' : '?';
      url += separator + 's512';

      return url;
    }

    // Повні зовнішні посилання — не чіпаємо
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Локальні аватари — завжди додаємо images/avatars/
    let cleanPath = url.replace(/^\/+/, ''); // прибираємо слеші на початку

    // Якщо вже починається з images/ — ок
    // Якщо avatars/ — додаємо images/ попереду
    // Якщо просто ім'я файлу — додаємо images/avatars/
    if (!cleanPath.startsWith('images/')) {
      if (cleanPath.startsWith('avatars/')) {
        cleanPath = 'images/' + cleanPath;
      } else {
        cleanPath = 'images/avatars/' + cleanPath;
      }
    }

    // Збираємо повний шлях
    const fullUrl = `${API_URL}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');

    return fullUrl;
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleLogout = () => {
    localStorage.clear();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navItems = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, active: isActive("/dashboard") },
    { to: "/dashboard-films", label: t("nav.movies"), icon: Film, active: isActive("/dashboard-films") },
    { to: "/dashboard-anime", label: t("nav.anime"), icon: Clapperboard, active: isActive("/dashboard-anime") },
    { to: "/dashboard-series", label: t("nav.series"), icon: Tv, active: isActive("/dashboard-series") },
    { to: "/dashboard-cartoons", label: t("nav.cartoons"), icon: Baby, active: isActive("/dashboard-cartoons") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              className="lg:hidden p-1.5 -ml-1 text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Відкрити меню"
            >
              <Menu size={22} className="sm:size-6" />
            </button>

            <Link
              to="/dashboard"
              onClick={scrollToTop}
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
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={scrollToTop}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${item.active
                  ? "bg-indigo-700/50 text-white shadow-md shadow-indigo-900/40"
                  : "text-gray-300 hover:bg-indigo-900/30 hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="p-2 rounded-lg cursor-pointer border-gray-700 hover:bg-indigo-900/40 text-indigo-400"
                aria-label="Фільтри"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17V13.414a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl p-4 z-50">
                  <FilterBar
                    selectedGenres={selectedGenres}
                    setSelectedGenres={setSelectedGenres}
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                  />
                </div>
              )}
            </div>

            <LanguageSwitcher />

            {/* Mobile: тільки ім'я */}
            <div className="lg:hidden font-medium text-gray-300 text-sm sm:text-base truncate max-w-[100px] sm:max-w-[130px]">
              {user?.name || "Гість"}
            </div>

            {/* Desktop: аватар + ім'я + дропдаун */}
            <div className="hidden lg:flex items-center relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 lg:gap-3 hover:bg-gray-800/50 px-3 lg:px-4 py-2 rounded-xl transition-all duration-200"
              >
                <img
                  src={getAvatarSrc()}
                  alt="Avatar"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover ring-2 ring-indigo-500/50 shadow-md transition-transform duration-200"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const originalSrc = target.src;

                    // Спроба 1: великий розмір без -c
                    if (originalSrc.includes("googleusercontent") && !originalSrc.includes("s512")) {
                      target.src = originalSrc.replace(/=s\d+-?c?/, "") + "=s512";
                      return;
                    }

                    // Спроба 2: ще більший розмір
                    if (!originalSrc.includes("s800")) {
                      target.src = originalSrc.replace(/=s\d+/, "=s800");
                      return;
                    }

                    // Спроба 3: дефолтна аватарка
                    target.src = getDefaultAvatar(user?.name || "Гість");
                    target.onerror = null; // більше не зациклюємо
                  }}
                />
                <span className="hidden md:block font-medium text-gray-200 truncate max-w-[140px] lg:max-w-[180px]">
                  {user?.name || "Гість"}
                </span>
              </button>

              {isUserDropdownOpen && (
                <div
                  className={`
                    absolute 
                    right-0 lg:right-[-0.5rem] xl:right-[-1.5rem] 2xl:right-[-2rem]
                    top-full mt-2 lg:mt-3
                    min-w-[320px] w-80 lg:w-96
                    bg-gray-950/95 backdrop-blur-xl 
                    border border-gray-700/60 rounded-2xl 
                    shadow-2xl shadow-black/70 
                    overflow-hidden z-[9999]
                    transform origin-top-right
                    animate-in fade-in zoom-in-95 duration-150 ease-out
                  `}
                >
                  {/* Верхня частина */}
                  <div className="p-5 lg:p-6 bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-indigo-950/80 border-b border-gray-800/50">
                    <p className="font-bold text-lg lg:text-xl text-white truncate leading-tight">
                      {user?.name || "Гість"}
                    </p>
                    {isAuthenticated && userPlan && (
                      <p className="text-sm text-indigo-300/90 mt-1.5 font-medium">
                        {t(`subscription.${userPlan}`)}
                      </p>
                    )}
                  </div>

                  {/* Пункти меню */}
                  <div className="py-1.5 lg:py-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                    <DropdownItem
                      to="/profile"
                      icon={User}
                      label={t("user.profile")}
                      color="indigo"
                      close={() => setIsUserDropdownOpen(false)}
                    />
                    <DropdownItem
                      to="/favorites"
                      icon={Heart}
                      label={t("favorites.title")}
                      color="red"
                      close={() => setIsUserDropdownOpen(false)}
                    />
                    <DropdownItem
                      to="/watch-later"
                      icon={Clock}
                      label={t("watchLater.title")}
                      color="blue"
                      close={() => setIsUserDropdownOpen(false)}
                    />
                    <DropdownItem
                      to="/watch-history"
                      icon={History}
                      label={t("watch_history.title") || "Історія переглядів"}
                      color="yellow"
                      close={() => setIsUserDropdownOpen(false)}
                    />
                    <DropdownItem
                      to="/subscriptions"
                      icon={CreditCard}
                      label={t("user.subscriptions")}
                      color="indigo"
                      close={() => setIsUserDropdownOpen(false)}
                    />

                    {/* Адмін-панель на десктопі */}
                    {isAdmin && (
                      <>
                        <div className="h-px bg-gray-800/60 my-2 mx-4 lg:mx-5" />
                        <DropdownItem
                          to="/admin/users"
                          icon={ShieldCheck}
                          label="Адмін-панель"
                          color="purple"
                          close={() => setIsUserDropdownOpen(false)}
                        />
                      </>
                    )}

                    <div className="h-px bg-gray-800/60 my-2 mx-4 lg:mx-5" />

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-3.5 lg:gap-4 px-5 lg:px-6 py-3.5 hover:bg-red-950/70 text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                    >
                      <LogOut size={20} className="lg:size-5" />
                      {t("user.exit_account")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


      </header>

      {/* Мобільне меню */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div
            ref={mobileMenuRef}
            className="absolute top-0 left-0 h-full w-4/5 max-w-xs bg-gray-950 border-r border-gray-800 shadow-2xl transform transition-transform duration-300 translate-x-0 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <span className="text-lg font-bold text-indigo-400">Меню</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="flex-1 py-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    scrollToTop();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-5 py-3.5 text-base ${item.active ? "bg-indigo-900/40 text-white" : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-gray-800 my-2 mx-5" />

              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-gray-200 hover:bg-gray-800/50 text-base"
              >
                <User size={20} className="text-indigo-400" />
                {t("user.profile")}
              </Link>

              <Link
                to="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-gray-200 hover:bg-gray-800/50 text-base"
              >
                <Heart size={20} className="text-red-400" />
                {t("favorites.title")}
              </Link>

              <Link
                to="/watch-later"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-gray-200 hover:bg-gray-800/50 text-base"
              >
                <Clock size={20} className="text-blue-400" />
                {t("watchLater.title")}
              </Link>

              <Link
                to="/watch-history"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-gray-200 hover:bg-gray-800/50 text-base"
              >
                <History size={20} className="text-yellow-400" />
                {t("watch_history.title") || "Історія переглядів"}
              </Link>

              <Link
                to="/subscriptions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-gray-200 hover:bg-gray-800/50 text-base"
              >
                <CreditCard size={20} className="text-indigo-400" />
                {t("user.subscriptions")}
              </Link>

              {/* Адмін-панель */}
              {isAdmin && (
                <Link
                  to="/admin/users"
                  onClick={() => {
                    scrollToTop();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-5 py-3.5 text-gray-200 hover:bg-gray-800/50 text-base"
                >
                  <ShieldCheck size={20} className="text-purple-400" />
                  Адмін-панель
                </Link>
              )}
            </div>

            <div className="border-t border-gray-800  p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-3  bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-xl transition text-base font-medium"
              >
                <LogOut size={20} />
                {t("user.exit_account")}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <AnimatedOutlet transition="fadeInUp" />
      </main>

      <footer className="bg-black/70 border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        {t("footer.copyright")}
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ring-4 ring-indigo-600/30 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14"
          aria-label="Повернутися вгору"
        >
          <ArrowUp size={24} className="text-white" />
        </button>
      )}
    </div>
  );
};

function DropdownItem({
  to,
  icon: Icon,
  label,
  color,
  close,
}: {
  to: string;
  icon: any;
  label: string;
  color: "indigo" | "red" | "blue" | "yellow" | "purple";
  close: () => void;
}) {
  const colors = {
    indigo: "text-indigo-400",
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
  };

  return (
    <Link
      to={to}
      onClick={close}
      className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-800/60 transition text-gray-100"
    >
      <Icon size={20} className={colors[color]} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default UserLayout;