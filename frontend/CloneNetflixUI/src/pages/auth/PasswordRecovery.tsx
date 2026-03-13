// src/pages/dashboard/PasswordRecovery.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      const response = await fetch(`${API_URL}/api/Auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        toast.success(
          "Лист з посиланням для відновлення паролю надіслано на вашу пошту!"
        );
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Помилка сервера. Спробуйте пізніше.");
      }
    } catch (err) {
      toast.error(
        "Не вдалося підключитися до сервера. Перевірте інтернет-з'єднання."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950/40 to-black px-4 py-12">
      <div className="w-full max-w-md bg-gray-900/85 backdrop-blur-2xl rounded-3xl border border-gray-800/60 shadow-2xl shadow-indigo-950/50 overflow-hidden transform transition-all duration-500 hover:shadow-indigo-900/40">
        <div className="px-8 pt-12 pb-10 ">
          {/* Заголовок з градієнтом */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            Відновлення паролю
          </h2>

          <p className="text-center text-gray-400 mb-10 text-base font-light">
            Введіть вашу електронну пошту, щоб отримати посилання для скидання паролю
          </p>



          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Поле email */}
            <div>

              <input
                type="email"
                placeholder="example@gmail.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full px-6 py-4 
                  bg-gray-800/70 border border-gray-700/80 rounded-2xl 
                  text-white placeholder-gray-500 text-base
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20
                  outline-none transition-all duration-300 ease-in-out
                  shadow-inner
                "
                autoComplete="email"
              />
            </div>

            {/* Кнопка submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                relative w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white
                transition-all duration-300 ease-in-out transform
                shadow-xl shadow-indigo-900/40 overflow-hidden
                ${loading
                  ? "bg-indigo-700/50 cursor-wait opacity-70"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:scale-[0.98] hover:shadow-2xl hover:shadow-purple-900/50"
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
                  Відправляється...
                </span>
              ) : (
                "Відправити посилання"
              )}

              {/* Легкий градієнтний ефект при наведенні */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </button>
          </form>

          {/* Посилання назад */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium"
            >
              Повернутися до входу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;