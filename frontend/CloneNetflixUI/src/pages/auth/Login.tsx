// src/pages/Login.tsx
import { useState } from "react";

import { Eye, EyeOff } from "lucide-react"; // додай Chrome іконку або будь-яку іншу

import { $t } from "../../lib/toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // <--- додай в .env !

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const mapError = (raw: any) => {
    if (!raw) return t("auth.error_generic");
    const text = String(raw).toLowerCase();
    if (text.includes("invalid") && text.includes("credential")) return t("auth.invalid_credentials");
    if (text.includes("invalid") && text.includes("email")) return t("validation.invalid_email");
    if (text.includes("password") && text.includes("incorrect")) return t("auth.invalid_credentials");
    if (text.includes("unauthor") || text.includes("token") || text.includes("not authorized")) return t("auth.invalid_credentials");
    if (text.includes("network") || text.includes("failed") || text.includes("timeout")) return t("auth.error_generic");
    return raw;
  };

  // ── Звичайний логін (email + password) ──
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginRes = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        throw new Error(errData.message || errData.error || "Помилка входу");
      }

      const loginData = await loginRes.json();
      await handleSuccessfulLogin(loginData.token);
    } catch (err: any) {
      const raw = err?.message || "";
      const message = mapError(raw);
      $t.error(message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // ── Загальна логіка після отримання JWT (використовується і для email, і для Google) ──
  const handleSuccessfulLogin = async (token: string) => {

    if (!token) {
      throw new Error("Токен не отримано");
    }


    localStorage.setItem("token", token);

    let userId: string | null = null;
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.sub || decoded.userId || decoded.id || decoded.nameid || null;
    } catch (decodeErr) {
      console.warn("Не вдалося декодувати токен для userId", decodeErr);
    }

    let userData: any = {};

    if (userId) {
      const userRes = await fetch(`${API_URL}/api/users/admin/get-user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (userRes.ok) {
        userData = await userRes.json();
      } else {
        console.warn("Не вдалося отримати користувача по ID, статус:", userRes.status);
      }
    }



    const userEmail = userData.email || email || "";

    // Частина до @ для fallback або коли потрібно
    const emailPrefix = userEmail.includes("@")
      ? userEmail.split("@")[0].trim()
      : userEmail.trim() || "Користувач";

    // ── Логіка userName: якщо є @ → обрізаємо до @, інакше лишаємо як є ──
    let finalUserName =
      userData.userName ||
      userData.username ||
      userData.name ||
      userData.fullName ||
      userData.displayName ||
      emailPrefix ||
      "Користувач";

    // Якщо в отриманому імені є @ — беремо тільки до нього
    if (typeof finalUserName === "string" && finalUserName.includes("@")) {
      finalUserName = finalUserName.split("@")[0].trim();
    }

    // Захист від порожнього рядка
    if (!finalUserName.trim()) {
      finalUserName = emailPrefix || "Користувач";
    }

    const normalizedUser = {
      userName: finalUserName,
      avatarUrl:
        userData.avatarUrl ||
        userData.avatar ||
        userData.photo ||
        userData.profilePicture ||
        null,
      email: userEmail,

    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));

    $t.success(t("auth.login_success") || "Вхід успішний!");
    navigate("/dashboard");
  };
  // ── Google Login ──
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);

      const googleToken = credentialResponse.credential; // це ID Token (JWT від Google)

      const res = await fetch(`${API_URL}/api/Auth/GoogleLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Помилка Google авторизації");
      }

      const data = await res.json();
      await handleSuccessfulLogin(data.token); // твій бекенд повертає свій JWT
    } catch (err: any) {
      $t.error(mapError(err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    $t.error(t("auth.google_login_failed") || "Не вдалося увійти через Google");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950/40 to-black px-4 py-12">
      <div className="w-full max-w-lg bg-gray-900/85 backdrop-blur-2xl rounded-3xl border border-gray-800/60 shadow-2xl shadow-indigo-950/50 overflow-hidden transform transition-all duration-500 hover:shadow-indigo-900/40">
        <div className="px-10 pt-14 pb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            {t("auth.login")}
          </h2>

          <p className="text-center text-gray-400 mb-10 text-base font-light">
            {t("auth.create_account")}{" "}
            <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium">
              {t("auth.register")}
            </a>
          </p>

          <form className="space-y-8" onSubmit={handleEmailLogin}>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"

                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.email_placeholder")}
                className="w-full px-6 py-4 bg-gray-800/70 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20 outline-none transition-all duration-300 ease-in-out shadow-inner"
                autoComplete="email"
              />
            </div>

            {/* Пароль */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.password_placeholder")}
                className="w-full px-6 py-4 pr-14 bg-gray-800/70 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:shadow-lg focus:shadow-indigo-500/20 outline-none transition-all duration-300 ease-in-out shadow-inner"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-6 h-6" strokeWidth={2.5} /> : <Eye className="w-6 h-6" strokeWidth={2.5} />}
              </button>
            </div>

            <div className="text-right">
              <a href="/password-recovery" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm font-medium">
                {t("auth.forgot_password")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white transition-all duration-300 ease-in-out transform shadow-xl shadow-indigo-900/40 overflow-hidden
                  ${loading ? "bg-indigo-700/50 cursor-wait opacity-70" : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:scale-[0.98] hover:shadow-2xl hover:shadow-purple-900/50"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t("auth.logging_in") || "Вхід..."}
                </span>
              ) : (
                t("auth.login_button") || "Увійти"
              )}
            </button>
          </form>

          
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/85 text-gray-400">{"або"}</span>

              </div >
            </div > 

          {/* Google кнопка */}
          
            < div className="mt-6 w-full flex justify-center text-center" >
              <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg flex justify-center transition">
                <GoogleLogin

                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  shape="rectangular"
                  logo_alignment="left"
                  text="signin_with"
                  width="100%"
                />
              </div>
            </div >


        </div >
      </div >
    </div >
     </GoogleOAuthProvider >
  );
}
