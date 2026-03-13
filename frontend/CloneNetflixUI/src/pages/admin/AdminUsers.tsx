// src/pages/AdminUsers.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Layout, Plus, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminUsersApi } from '../../api/AdminApiUser'; // ← твій шлях до api
import ConfirmBlockModal from '../../components/AdminConfirmBlockUserModal';
import ConfirmDeleteModal from '../../components/AdminConfirmDeleteUserModal';

interface User {
  id: string;
  userName: string;
  email: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  isBlocked: boolean;
}

interface UserFormData {
  userName: string;
  email: string;
  dateOfBirth: string;
  password?: string;
  confirmPassword?: string;
  roles: string[];
  imageFile?: File | null;
  imagePreview?: string;
  isBlocked: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [showConfirmBlockModal, setShowConfirmBlockModal] = useState(false);
  const [confirmBlockUserId, setConfirmBlockUserId] = useState<string | null>(null);
  const [confirmNewBlocked, setConfirmNewBlocked] = useState(false);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const navigate = useNavigate();

  const [form, setForm] = useState<UserFormData>({
    userName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    roles: ['User'],
    imageFile: null,
    imagePreview: '',
    isBlocked: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const DEFAULT_AVATAR = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminUsersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Помилка завантаження користувачів:', err);
      setError('Не вдалося завантажити користувачів');
      toast.error('Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const resetForm = () => {
    setForm({
      userName: '',
      email: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      roles: ['User'],
      imageFile: null,
      imagePreview: '',
      isBlocked: false,
    });
    setEditingId(null);
    setIsCreating(true);
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const loadUserForEdit = async (id: string) => {
    try {
      const user = await adminUsersApi.getById(id);

      const avatarPreview = user.avatarUrl
        ? `${API_URL}/${user.avatarUrl.replace(/^\/+/, '')}`
        : DEFAULT_AVATAR(user.userName || 'User');

      setForm({
        userName: user.userName || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth?.split('T')[0] || '',
        password: '',
        confirmPassword: '',
        roles: user.roles || ['User'],
        imageFile: null,
        imagePreview: avatarPreview,
        isBlocked: user.isBlocked || false,
      });

      setEditingId(id);
      setIsCreating(false);
      setShowModal(true);
      setFormErrors({});
    } catch (err) {
      toast.error('Не вдалося завантажити дані користувача');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Partial<Record<keyof UserFormData, string>> = {};
    if (!form.userName.trim()) errors.userName = "Ім'я обов'язкове";
    if (!form.email.trim()) errors.email = "Email обов'язковий";
    if (isCreating) {
      if (!form.password?.trim()) errors.password = "Пароль обов'язковий";
      if (form.password !== form.confirmPassword) errors.confirmPassword = "Паролі не співпадають";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isCreating) {
        await adminUsersApi.create({
          userName: form.userName.trim(),
          email: form.email.trim(),
          password: form.password!.trim(),
          confirmPassword: form.confirmPassword!.trim(),
          dateOfBirth: form.dateOfBirth || undefined,
          roles: form.roles,
          avatar: form.imageFile ?? undefined,
        });
        toast.success('Користувача створено');
      } else {
        await adminUsersApi.update(editingId!, {
          userName: form.userName.trim(),
          email: form.email.trim(),
          dateOfBirth: form.dateOfBirth || undefined,
          avatar: form.imageFile ?? undefined,
          roles: form.roles,
          // isBlocked тут не змінюємо — для цього є окрема кнопка
        });
        toast.success('Користувача оновлено');
      }

      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      console.error('Помилка збереження:', err);
      let msg = 'Помилка збереження';
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.response?.data?.errors) {
        const firstKey = Object.keys(err.response.data.errors)[0];
        if (firstKey && Array.isArray(err.response.data.errors[firstKey])) {
          msg = err.response.data.errors[firstKey][0];
        }
      }
      toast.error(msg);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteUserId(id);
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDeleteUserId) return;

    try {
      await adminUsersApi.delete(confirmDeleteUserId);
      toast.error('Користувача видалено');
      loadUsers();
    } catch (err) {
      toast.error('Помилка видалення');
    } finally {
      setShowConfirmDeleteModal(false);
      setConfirmDeleteUserId(null);
    }
  };

  const handleBlock = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
      toast.error('Користувача не знайдено');
      return;
    }

    const newIsBlocked = !user.isBlocked;
    setConfirmBlockUserId(id);
    setConfirmNewBlocked(newIsBlocked);
    setShowConfirmBlockModal(true);
  };

  const confirmBlockAction = async () => {
    if (!confirmBlockUserId) return;

    const user = users.find(u => u.id === confirmBlockUserId);
    if (!user) return;

    try {

      await adminUsersApi.update(confirmBlockUserId, {

        userName: user.userName || undefined,
        email: user.email || undefined,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : undefined,
        roles: user.roles?.length ? user.roles : undefined,
        isBlocked: confirmNewBlocked,
      });

      setUsers(prev =>
        prev.map(u =>
          u.id === confirmBlockUserId ? { ...u, isBlocked: confirmNewBlocked } : u
        )
      );
      if (confirmNewBlocked == false) {
        toast.success('Користувача розблоковано');
      } else {
        toast.error('Користувача заблоковано')
      }


    } catch (err: any) {
      console.error('Помилка зміни статусу блокування:', err);
      let msg = 'Не вдалося змінити статус блокування';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      toast.error(msg);
    } finally {
      setShowConfirmBlockModal(false);
      setConfirmBlockUserId(null);
      setConfirmNewBlocked(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Максимальний розмір файлу — 5 МБ');
        return;
      }
      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.userName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term);
    const matchesRole =
      roleFilter === 'all' || u.roles?.some((r) => r.toLowerCase() === roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 py-12 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок + кнопки */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <h1 className="mb-2 text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Користувачі
            </h1>

            <button
              onClick={loadUsers}
              disabled={loading}
              title="Оновити список"
              className={`p-2.5 rounded-full transition-all duration-200 ${loading
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-950/40 active:scale-95'
                }`}
            >
              <RefreshCw size={28} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus size={20} /> Додати користувача
            </button>
            <button
              onClick={() => navigate('/admin/contents')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Layout size={20} /> Контент
            </button>
          </div>
        </div>

        {/* Фільтри */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Пошук за ім'ям або email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
          >
            <option value="all">Всі ролі</option>
            <option value="Admin">Адміністратори</option>
            <option value="User">Користувачі</option>
          </select>
        </div>

        {/* Таблиця */}
        {loading ? (
          <div className="text-center py-32 text-indigo-400 text-2xl animate-pulse">Завантаження...</div>
        ) : error ? (
          <div className="text-center py-32 text-red-500 text-2xl">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-32 text-gray-400 text-2xl">Користувачів не знайдено</div>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Аватар
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Ім'я
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Дата народження
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Ролі
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Блокування
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-indigo-950/30 transition duration-200">
                      <td className="px-8 py-6">
                        <img
                          src={
                            user.avatarUrl && user.avatarUrl.trim()
                              ? `${API_URL}/${user.avatarUrl.replace(/^\/+/, '')}`
                              : DEFAULT_AVATAR(user.userName || 'User')
                          }
                          alt={user.userName}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_AVATAR(user.userName || 'User');
                          }}
                        />
                      </td>
                      <td className="px-8 py-6 font-medium text-white">{user.userName}</td>
                      <td className="px-8 py-6 text-gray-300">{user.email}</td>
                      <td className="px-8 py-6 text-gray-300">
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('uk-UA') : '—'}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={user.isBlocked}
                            onChange={() => handleBlock(user.id)}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-14 h-7 rounded-full p-1 transition-all duration-400 ease-in-out shadow-inner ${user.isBlocked
                              ? 'bg-gradient-to-r from-red-600 to-rose-700'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                              } group-hover:shadow-lg group-hover:shadow-black/40`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-400 ease-out ${user.isBlocked ? 'translate-x-7 scale-110' : 'translate-x-0'
                                }`}
                            />
                          </div>
                        </label>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => loadUserForEdit(user.id)}
                            className="p-3 rounded-full bg-indigo-900/40 hover:bg-indigo-700/70 text-indigo-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow-indigo-500/40"
                            title="Редагувати"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-3 rounded-full bg-red-900/40 hover:bg-red-700/70 text-red-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow-red-500/40"
                            title="Видалити"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Модалка створення/редагування */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    {isCreating ? 'Додати користувача' : 'Редагувати користувача'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white text-4xl transition"
                  >
                    <X size={40} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-gray-300 font-medium mb-3">Ім'я *</label>
                      <input
                        value={form.userName}
                        onChange={(e) => setForm({ ...form, userName: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                      />
                      {formErrors.userName && <p className="mt-2 text-red-400 text-sm">{formErrors.userName}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-3">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                      />
                      {formErrors.email && <p className="mt-2 text-red-400 text-sm">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-3">Дата народження</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                      className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                    />
                  </div>

                  {isCreating && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Пароль *</label>
                        <input
                          type="password"
                          value={form.password || ''}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                        />
                        {formErrors.password && <p className="mt-2 text-red-400 text-sm">{formErrors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Підтвердження пароля *</label>
                        <input
                          type="password"
                          value={form.confirmPassword || ''}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                        />
                        {formErrors.confirmPassword && (
                          <p className="mt-2 text-red-400 text-sm">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-300 font-medium mb-3">Аватар</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <label className="cursor-pointer bg-indigo-900/30 hover:bg-indigo-800 px-6 py-4 rounded-xl transition text-indigo-300 font-medium">
                        Обрати фото
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {form.imagePreview ? (
                        <img
                          src={form.imagePreview}
                          alt="Прев'ю аватарки"
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-indigo-500 shadow-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_AVATAR(form.userName || 'User');
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                          Немає фото
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-3">Ролі</label>
                    <select
                      multiple
                      value={form.roles}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                        setForm({ ...form, roles: selected });
                      }}
                      className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition h-32"
                    >
                      <option value="User">Користувач</option>
                      <option value="Admin">Адміністратор</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-6 pt-10 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-12 py-5 border border-gray-700 rounded-2xl text-gray-300 hover:bg-gray-800 transition font-medium"
                    >
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl text-white font-bold shadow-xl transition-all hover:scale-105"
                    >
                      {isCreating ? 'Створити' : 'Зберегти зміни'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmBlockModal
          isOpen={showConfirmBlockModal}
          onClose={() => setShowConfirmBlockModal(false)}
          onConfirm={confirmBlockAction}
          userName={users.find((u) => u.id === confirmBlockUserId)?.userName || "—"}
          isBlocking={confirmNewBlocked}
        />
        <ConfirmDeleteModal
          isOpen={showConfirmDeleteModal}
          onClose={() => setShowConfirmDeleteModal(false)}
          onConfirm={confirmDeleteAction}
          userName={users.find((u) => u.id === confirmDeleteUserId)?.userName || "—"}
        />
      </div>
    </div>
  );
};

export default AdminUsers;