// src/pages/Register.tsx
import { useState } from "react";


import { Eye, EyeOff } from "lucide-react";
import { $t } from "../../lib/toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {

      newErrors.email = t("validation.enter_email") || "Введіть email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("validation.invalid_email") || "Невірний формат email";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t("validation.enter_dob") || "Вкажіть дату народження";
    }

    if (!formData.password) {
      newErrors.password = t("validation.enter_password") || "Введіть пароль";
    } else if (formData.password.length < 8) {
      newErrors.password = t("validation.password_min") || "Пароль має бути не менше 8 символів";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("validation.passwords_mismatch") || "Паролі не співпадають";
    }

    if (!agree) {
      newErrors.agree = t("validation.accept_terms") || "Потрібна згода з умовами";

    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Звичайна реєстрація (email + пароль)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);


    const payload = {
      Email: formData.email.trim(),
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
      DateOfBirth: formData.dateOfBirth,
    };

    try {
      const res = await fetch(`${API_URL}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        const message =
          errData.message ||
          errData.errors?.Email?.[0] ||
          errData.errors?.Password?.[0] ||
          "Помилка реєстрації";
        throw new Error(message);
      }

      $t.success(t("auth.register_success") || "Реєстрація успішна! Увійдіть в акаунт.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      const msg = err.message || t("auth.error_generic") || "Щось пішло не так...";

      if (msg.toLowerCase().includes("already") || msg.includes("вже існує")) {
        setErrors({ email: t("auth.email_taken") || "Такий email вже зареєстровано" });
      }

      $t.error(msg);

    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950/40 to-black px-4 py-12">
      <div className="w-full max-w-lg bg-gray-900/85 backdrop-blur-2xl rounded-3xl border border-gray-800/60 shadow-2xl shadow-indigo-950/50 overflow-hidden transform transition-all duration-500 hover:shadow-indigo-900/40">
        <div className="px-10 pt-14 pb-12">

          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            {t("auth.create_account") || "Створити акаунт"}
          </h2>

          <p className="text-center text-gray-400 mb-10 text-base font-light">
            {t("auth.already_have_account") || "Вже є акаунт?"} {" "}

            <a
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium"
            >
              {t("auth.login") || "Увійти"}

            </a >
          </p >

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder={t("auth.email_placeholder") || "Ваш email"}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-6 py-4 bg-gray-800/70 border ${errors.email ? "border-red-500/60" : "border-gray-700/80"
                  } rounded-2xl text-white placeholder-gray-500 text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20 outline-none transition-all duration-300 ease-in-out shadow-inner`}
                autoComplete="email"
                required
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}

            </div>

            {/* Дата народження */}
            <div>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full px-6 py-4 bg-gray-800/70 border ${errors.dateOfBirth ? "border-red-500/60" : "border-gray-700/80"
                  } rounded-2xl text-white text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20 outline-none transition-all duration-300 ease-in-out shadow-inner`}
                required
              />
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-400">{errors.dateOfBirth}</p>

              )}
            </div>

            {/* Пароль */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("auth.password_placeholder") || "Пароль"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-6 py-4 pr-14 bg-gray-800/70 border ${errors.password ? "border-red-500/60" : "border-gray-700/80"
                  } rounded-2xl text-white placeholder-gray-500 text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20 outline-none transition-all duration-300 ease-in-out shadow-inner`}
                autoComplete="new-password"
                required

              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"

              >
                {showPassword ? (
                  <EyeOff className="w-6 h-6" strokeWidth={2.5} />
                ) : (
                  <Eye className="w-6 h-6" strokeWidth={2.5} />
                )}
              </button>
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div >

            {/* Підтвердження пароля */}

            < div className="relative" >
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder={t("auth.password_placeholder") || "Підтвердіть пароль"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-6 py-4 pr-14 bg-gray-800/70 border ${errors.confirmPassword ? "border-red-500/60" : "border-gray-700/80"
                  } rounded-2xl text-white placeholder-gray-500 text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20 outline-none transition-all duration-300 ease-in-out shadow-inner`}
                autoComplete="new-password"
                required

              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"

              >
                {showConfirm ? (
                  <EyeOff className="w-6 h-6" strokeWidth={2.5} />
                ) : (
                  <Eye className="w-6 h-6" strokeWidth={2.5} />
                )}
              </button>
              {
                errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                )
              }
            </div >

            {/* Згода з умовами */}

            < div className="flex items-center gap-3 pt-2" >
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 text-indigo-600 rounded border-gray-700/80 focus:ring-indigo-500/50 bg-gray-800/70"
              />
              <label htmlFor="agree" className="text-sm text-gray-300 select-none">
                {t("auth.agree_prefix") || "Я погоджуюсь з"}{" "}

                <a
                  href="/terms"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("auth.terms") || "умовами використання"}
                </a >
              </label >
            </div >
            {errors.agree && <p className="text-sm text-red-400">{errors.agree}</p>}


            {/* Кнопка реєстрації */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white transition-all duration-300 ease-in-out transform shadow-xl shadow-indigo-900/40 overflow-hidden ${isLoading
                ? "bg-indigo-700/50 cursor-wait opacity-70"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:scale-[0.98] hover:shadow-2xl hover:shadow-purple-900/50"
                }`}

            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-6 w-6 text-white"

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
                  {t("auth.registering") || "Реєстрація..."}
                </span >
              ) : (
                t("auth.register_button") || "Зареєструватися"
              )
              }
            </button >
          </form >


        </div >
      </div >
    </div >

  );
}