import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Layout, Plus, RefreshCw, ArrowUpDown } from 'lucide-react';
import { ApiAdminFilms } from '../../api/ApiAdminFilms';
import ContentModal from '../../components/ContentModal';
import { useNavigate } from 'react-router-dom';

interface ContentItem {
    id: string;
    title: string;
    description?: string;
    type: number;
    releaseYear?: number;
    duration?: number;
    rating?: number;
    ageLimit?: number;
    posterUrl?: string;
    detailsPosterUrl?: string;
    trailerUrl?: string;
    genreIds?: string[];
    franchiseId?: string;
    collectionIds?: string[];
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminContents() {
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

    // Пошук та сортування
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingSort, setRatingSort] = useState<'asc' | 'desc' | null>(null); // null = без сортування

    const navigate = useNavigate();

    useEffect(() => {
        loadContents();
    }, []);

    const loadContents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiAdminFilms.contents.getAll();
            const items = data?.items || [];
            setContents(Array.isArray(items) ? items : []);
        } catch (err: any) {
            console.error('Помилка завантаження контенту:', err);
            setError('Не вдалося завантажити контент');
            toast.error('Помилка завантаження');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData: FormData) => {
        try {
            if (editingItem) {
                await ApiAdminFilms.contents.updateMultipart(editingItem.id, formData);
                toast.success('Контент оновлено');
            } else {
                await ApiAdminFilms.contents.createMultipart(formData);
                toast.success('Контент додано');
            }
            setModalOpen(false);
            setEditingItem(null);
            loadContents();
        } catch (err: any) {
            console.error('Помилка збереження:', err);
            toast.error(err.message || 'Помилка збереження');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Видалити цей контент назавжди?')) return;
        try {
            await ApiAdminFilms.contents.delete(id);
            toast.success('Контент видалено');
            loadContents();
        } catch (err: any) {
            toast.error('Не вдалося видалити контент');
        }
    };

    // Обчислювані відфільтровані та відсортовані дані
    const displayedContents = useMemo(() => {
        let result = [...contents];

        // Пошук за назвою (нечутливий до регістру)
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(item =>
                item.title?.toLowerCase().includes(term)
            );
        }

        // Сортування по рейтингу
        if (ratingSort) {
            result.sort((a, b) => {
                const ratingA = a.rating ?? 0; // якщо немає рейтингу — вважаємо 0
                const ratingB = b.rating ?? 0;

                if (ratingSort === 'asc') {
                    return ratingA - ratingB;
                } else {
                    return ratingB - ratingA;
                }
            });
        }

        return result;
    }, [contents, searchTerm, ratingSort]);

    const toggleRatingSort = () => {
        setRatingSort(prev => {
            if (prev === null) return 'asc';
            if (prev === 'asc') return 'desc';
            return null;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 py-12 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Заголовок + кнопки */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <h1 className="mb-4 text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            Контент
                        </h1>

                        <button
                            onClick={loadContents}
                            disabled={loading}
                            title="Оновити список"
                            className={`
                                p-2.5 rounded-full transition-all duration-200
                                ${loading
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-950/40 active:scale-95'
                                }
                            `}
                        >
                            <RefreshCw
                                size={28}
                                className={loading ? 'animate-spin' : ''}
                            />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setModalOpen(true);
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} /> Додати контент
                        </button>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Layout size={20} /> Панель користувачів
                        </button>
                    </div>
                </div>

                {/* Пошук */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Пошук за назвою..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
                    />
                </div>

                {/* Таблиця / стани */}
                {loading ? (
                    <div className="text-center py-32 text-indigo-400 text-2xl animate-pulse">Завантаження...</div>
                ) : error ? (
                    <div className="text-center py-32 text-red-500 text-2xl">{error}</div>
                ) : displayedContents.length === 0 ? (
                    <div className="text-center py-32 text-gray-400 text-2xl">
                        {searchTerm ? 'Нічого не знайдено за запитом' : 'Контенту ще немає'}
                    </div>
                ) : (
                    <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-800/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Постер
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Назва
                                        </th>
                                        <th
                                            onClick={toggleRatingSort}
                                            className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-indigo-300 transition flex items-center gap-2"
                                        >
                                            Тип / Рейтинг
                                            <ArrowUpDown
                                                size={16}
                                                className={ratingSort ? 'text-indigo-400' : 'text-gray-500'}
                                            />
                                            {ratingSort && (
                                                <span className="text-xs normal-case font-normal">
                                                    {ratingSort === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Рік
                                        </th>
                                        <th className="px-8 py-5 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            Дії
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {displayedContents.map((item) => (
                                        <tr key={item.id} className="hover:bg-indigo-950/30 transition duration-200">
                                            <td className="px-8 py-6">
                                                {item.posterUrl ? (
                                                    <img
                                                        src={`${baseUrl}/${item.posterUrl}`}
                                                        alt={item.title}
                                                        className="w-16 h-24 object-cover rounded-lg shadow-md ring-1 ring-indigo-500/30"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/64x96?text=Немає+постера';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                                        немає
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 font-medium text-white">{item.title || '—'}</td>
                                            <td className="px-8 py-6 text-gray-300">
                                                {item.type === 1 ? 'Серіал' : 'Фільм'}{' '}
                                                {item.rating ? `(${item.rating})` : ''}
                                            </td>
                                            <td className="px-8 py-6 text-gray-300">{item.releaseYear || '—'}</td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(item);
                                                        setModalOpen(true);
                                                    }}
                                                    className="text-indigo-400 hover:text-indigo-300 text-2xl mr-6 transition"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-400 hover:text-red-300 text-2xl transition"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <ContentModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setEditingItem(null);
                    }}
                    initialData={editingItem}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}