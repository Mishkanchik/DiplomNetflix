// src/pages/dashboard/PasswordReset.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  useEffect(() => {
    if (!token || !email) {
      toast.error("Посилання для відновлення паролю недійсне або пошкоджене.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    if (newPassword !== confirmPassword) {
      toast.error("Паролі не співпадають");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Пароль має бути не коротшим за 8 символів");
      return;
    }

    if (!token || !email) {
      toast.error("Немає даних для зміни паролю");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/Auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: email?.trim(),
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("Пароль успішно змінено!");
      } else {
        toast.error(
          data.message ||
          "Не вдалося змінити пароль. Посилання могло бути використане або прострочене."
        );
      }
    } catch {
      toast.error("Помилка з'єднання з сервером. Перевірте інтернет.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950/30 to-black px-4 py-12">
      <div className="w-full max-w-lg bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-800/60 shadow-2xl shadow-black/50 overflow-hidden transform transition-all duration-300 hover:shadow-indigo-900/30">
        <div className="px-8 pt-12 pb-10">
          {/* Заголовок з градієнтом */}
          <h2 className="text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Встановити новий пароль
          </h2>

          <p className="text-center text-gray-400 mb-10 text-base">
            Введіть новий надійний пароль для вашого облікового запису
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Новий пароль */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Новий пароль
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="
                    w-full px-6 py-4 pr-14 
                    bg-gray-800/70 border border-gray-700/80 rounded-2xl 
                    text-white placeholder-gray-500
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 
                    focus:outline-none transition-all duration-200
                    shadow-inner
                  "
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Мінімум 8 символів"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="
                    absolute top-1/2 right-5 -translate-y-1/2 
                    text-gray-400 hover:text-indigo-400 transition-colors duration-200
                  "
                  aria-label={showNewPassword ? "Приховати пароль" : "Показати пароль"}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-6 h-6" strokeWidth={2} />
                  ) : (
                    <Eye className="w-6 h-6" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Підтвердження пароля */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Підтвердіть пароль
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="
                    w-full px-6 py-4 pr-14 
                    bg-gray-800/70 border border-gray-700/80 rounded-2xl 
                    text-white placeholder-gray-500
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 
                    focus:outline-none transition-all duration-200
                    shadow-inner
                  "
                  required
                  autoComplete="new-password"
                  placeholder="Повторіть пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="
                    absolute top-1/2 right-5 -translate-y-1/2 
                    text-gray-400 hover:text-indigo-400 transition-colors duration-200
                  "
                  aria-label={showConfirmPassword ? "Приховати пароль" : "Показати пароль"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-6 h-6" strokeWidth={2} />
                  ) : (
                    <Eye className="w-6 h-6" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Кнопка submit */}
            <button
              type="submit"
              disabled={loading || !token || !email}
              className={`
                w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white
                transition-all duration-300 ease-in-out transform
                shadow-xl shadow-indigo-900/30
                ${loading || !token || !email
                  ? "bg-indigo-700/50 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 active:scale-[0.98] hover:shadow-2xl hover:shadow-indigo-700/40"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Змінюємо...
                </span>
              ) : (
                "Змінити пароль"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;