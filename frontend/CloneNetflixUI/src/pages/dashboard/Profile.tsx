// src/pages/dashboard/Profile.tsx
import React, { useState, useEffect, useRef } from "react";
import { Camera, Check, X, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getMyProfile, updateMyProfile } from "../../api/User";
import ConfirmModal from "../../components/ConfirmModal";
import { deleteMyProfile } from "../../api/deleteUser";
import SubscriptionManagement from "./SubscriptionManagement";
import { useLoading } from "../../lib/useLoading";

interface ProfileData {
  userName: string;
  email: string;
  dateOfBirth: string;
  avatarUrl: string | null;
}

export default function Profile() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { withLoading } = useLoading();

  const [profile, setProfile] = useState<ProfileData>({
    userName: "Користувач",
    email: "",
    dateOfBirth: "",
    avatarUrl: null,
  });

  const [form, setForm] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
  });

  const [initialForm, setInitialForm] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Функція для "очищення" імені — якщо є @, беремо до @
  const cleanUsername = (name: string | undefined | null): string => {
    if (!name || typeof name !== "string") return "Користувач";

    const trimmed = name.trim();
    if (trimmed.includes("@")) {
      return trimmed.split("@")[0].trim() || "Користувач";
    }
    return trimmed || "Користувач";
  };

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

  const getAvatarSrc = () => {
    // Якщо є прев'ю завантаженого файлу — показуємо його
    if (previewUrl) return previewUrl;

    if (!profile.avatarUrl || profile.avatarUrl.trim() === "") {
      return getDefaultAvatar(profile.userName || form.username || "Користувач");
    }

    let url = profile.avatarUrl.trim();

    // Google аватарки — нормалізуємо розмір
    if (url.includes("googleusercontent.com") || url.includes("lh3.googleusercontent.com")) {
      url = url.replace(/=s\d+-c?/, '').replace(/-s\d+-c$/, '');
      const separator = url.includes('?') ? '&' : '?';
      url += separator + 's512';
      return url;
    }

    // Повні зовнішні посилання
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Локальні аватари — завжди images/avatars/
    let cleanPath = url.replace(/^\/+/, '');

    if (!cleanPath.startsWith('images/')) {
      if (cleanPath.startsWith('avatars/')) {
        cleanPath = 'images/' + cleanPath;
      } else {
        cleanPath = 'images/avatars/' + cleanPath;
      }
    }

    const fullUrl = `${API_URL}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');

    return fullUrl;
  };

  useEffect(() => {
    withLoading(async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t('profile.not_authorized'));
        navigate("/login");
        return;
      }

      try {
        const data = await getMyProfile();

        // Очищаємо userName одразу після отримання з сервера
        const cleanedUserName = cleanUsername(data.userName);

        const cleanedProfile = {
          ...data,
          userName: cleanedUserName,
        };

        setProfile(cleanedProfile);

        const initial = {
          username: cleanedUserName,
          email: data.email || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        };

        setForm(initial);
        setInitialForm(initial);
        setPreviewUrl(null);

        // Зберігаємо в localStorage вже очищене ім'я
        localStorage.setItem("user", JSON.stringify(cleanedProfile));

      } catch (err: any) {
        console.error("Не вдалося завантажити профіль:", err);
        toast.error(t('profile.read_error'));
      } finally {
        setLoading(false);
      }
    });
  }, [navigate, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.image_too_large'));
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(t('profile.select_image'));
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };


  const hasChanges = () => {
    return (
      form.username.trim() !== initialForm.username.trim() ||
      form.email.trim() !== initialForm.email.trim() ||
      form.dateOfBirth !== initialForm.dateOfBirth ||

      !!selectedFile
    );
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username.trim()) {
      toast.error(t('validation.enter_name'));
      return;
    }

    if (!hasChanges()) {
      toast("Немає змін для збереження", { icon: "ℹ️" });
      return;
    }

    await withLoading(async () => {
      try {
        const formData = new FormData();
        // Відправляємо те, що ввів користувач (бекенд сам вирішить, що зберігати)

        formData.append("Username", form.username.trim());
        formData.append("Email", form.email.trim());
        if (form.dateOfBirth) formData.append("DateOfBirth", form.dateOfBirth);

        if (selectedFile) {
          formData.append("avatar", selectedFile);
        }

        const updatedData = await updateMyProfile(formData);

        // Очищаємо отримане ім'я перед збереженням стану та localStorage
        const cleanedUpdatedName = cleanUsername(updatedData.userName);

        const cleanedUpdatedProfile = {
          ...updatedData,
          userName: cleanedUpdatedName,
        };

        setProfile(cleanedUpdatedProfile);

        const newInitial = {
          username: cleanedUpdatedName,
          email: updatedData.email || form.email,
          dateOfBirth: updatedData.dateOfBirth
            ? updatedData.dateOfBirth.split("T")[0]
            : form.dateOfBirth,
        };


        setForm(newInitial);
        setInitialForm(newInitial);
        setPreviewUrl(null);
        setSelectedFile(null);

        localStorage.setItem("user", JSON.stringify(cleanedUpdatedProfile));

        toast.success(t('profile.profile_updated'));

        // Оновлення сторінки (твій спосіб)
        navigate('/dashboard');
        setTimeout(() => {
          window.location.href = window.location.href + '?t=' + Date.now();
        }, 1000);


      } catch (err: any) {
        console.error("Помилка оновлення профілю:", err);
        toast.error(err.response?.data?.message || t('profile.update_failed'));
      }
    });
  };


  const handleRequestPasswordReset = async () => {
    if (!profile.email) {
      toast.error("Email не знайдено. Спробуйте перелогінитися.");
      return;
    }

    setResetPasswordLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/Auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email: profile.email.trim() }),
      });

      if (response.ok) {
        toast.success("Лист з посиланням для відновлення паролю надіслано!");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Помилка сервера.");
      }
    } catch (err) {
      toast.error("Не вдалося підключитися до сервера.");

    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMyProfile();
      toast.success(t('profile.deleted_success'));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err: any) {
      toast.error(t('profile.delete_failed'));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Показуємо очищене ім'я в інтерфейсі
  const displayedUsername = cleanUsername(form.username || profile.userName);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/30 to-black py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
          {t("profile.title") || "Мій профіль"}
        </h1>

        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Аватар + заголовок */}
          <div className="relative px-6 pt-16 pb-12 text-center bg-gradient-to-b from-indigo-950/40 to-transparent">
            <div className="relative inline-block group mx-auto">
              <img
                src={getAvatarSrc()}
                alt="Аватар користувача"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover ring-8 ring-indigo-600/30 shadow-2xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getDefaultAvatar(displayedUsername);

                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-gray-900 p-3.5 rounded-full border-2 border-indigo-500/50 shadow-lg hover:bg-gray-800 transition"
              >
                <Camera className="w-6 h-6 text-indigo-400" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
            </div>

            <h2 className="mt-8 text-3xl sm:text-4xl font-bold text-white">
              {displayedUsername}

            </h2>
            <p className="mt-3 text-lg text-gray-400">
              {profile.email || "—"}
            </p>
          </div>

          {/* Форма редагування */}

          <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-10 space-y-8">
            <div className="grid gap-7 md:grid-cols-2">
              <div>
                <label className="block text-gray-300 font-medium mb-2.5">
                  {t('profile.full_name')}
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                  placeholder={t('profile.enter_name')}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2.5">
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                  placeholder={t('auth.email_placeholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2.5">
                {t('profile.date_of_birth')}
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
              />
            </div>

            {/* Кнопка змінити пароль */}

            <div className="pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={handleRequestPasswordReset}
                disabled={resetPasswordLoading || !profile.email}
                className={`w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-semibold text-white shadow-lg transition disabled:opacity-60 ${resetPasswordLoading ? 'cursor-wait' : ''}`}
              >
                {resetPasswordLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Відправляємо...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Змінити пароль
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                На вашу пошту прийде лист з посиланням для зміни паролю
              </p>
            </div>

            {/* Кнопки */}

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 px-6 border border-gray-600 rounded-2xl text-gray-300 hover:bg-gray-800/60 transition flex items-center justify-center gap-2 order-2 sm:order-1"
              >
                <X size={18} /> {t('profile.cancel')}
              </button>

              <button
                type="submit"
                disabled={loading || !hasChanges()}
                className={`flex-1 py-4 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-semibold text-white shadow-lg shadow-indigo-900/40 transition disabled:opacity-60 flex items-center justify-center gap-2 order-1 sm:order-2 ${!hasChanges() ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {t('profile.save')}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 rounded-2xl font-semibold text-white shadow-lg transition order-3"
              >
                {language === 'uk' ? 'Видалити акаунт' : 'Delete account'}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-800 bg-gray-950/30 px-6 sm:px-10 py-12">
            <SubscriptionManagement />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('profile.delete_confirm_title_clear') || (language === 'uk' ? 'Видалення акаунта' : 'Delete account')}
        description={t('profile.delete_confirm_desc_clear') || (language === 'uk' ? 'Після видалення акаунта всі ваші дані буде втрачено. Ви впевнені?' : 'After deleting your account, all your data will be lost. Are you sure?')}

        confirmText={deleting ? (t('profile.deleting') || (language === 'uk' ? 'Видалення...' : 'Deleting...')) : (t('profile.confirm_delete_clear') || (language === 'uk' ? 'Видалити назавжди' : 'Delete permanently'))}
        cancelText={t('profile.cancel') || (language === 'uk' ? 'Скасувати' : 'Cancel')}
      />
    </div>
  );
}