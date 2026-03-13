// src/pages/dashboard/MovieDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { Heart, Clock } from "lucide-react";


import { useLanguage } from "../../contexts/LanguageContext";

// VideoPlayer component for inline video playback
const VideoPlayer: React.FC<{ src: string }> = ({ src }) => (
    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        <video
            src={src}
            controls
            className="w-full h-full bg-black"
        />
    </div>
);

import { useWatchHistory } from "../../lib/useWatchHistory";
import {
    fetchContentDetails,
    fetchContentVideos,
    fetchSimilarContent,
} from "../../api/tmdbDashboard";
import { GradientLoader } from "../../components/Loader";
import CommentsSection from '../../components/CommentsSection';
import MinimalRating from '../../components/MinimalRating';
import { useFavorites } from "../../lib/useFavorites";
import { useWatchLater } from "../../lib/useWatchLater";
import toast from "react-hot-toast";


const TMDB_IMG_BASE = import.meta.env.VITE_TMDB_IMG_BASE;
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

type ContentType = "movie" | "tv";

const MovieDetails: React.FC = () => {
    const { type, id } = useParams<{ type: ContentType; id: string }>();
    const navigate = useNavigate();
    const { t, getTMDBLanguage } = useLanguage();

    const [details, setDetails] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [similar, setSimilar] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const language = getTMDBLanguage();

    const { addToHistory } = useWatchHistory();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isInWatchLater, toggleWatchLater } = useWatchLater();

    const isFav = details ? isFavorite(details.id, type as ContentType) : false;
    const isWatchLater = details ? isInWatchLater(details.id, type as ContentType) : false;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!details || !type) return;
        toggleFavorite({
            id: details.id,
            mediaType: type as ContentType,
            title: details.title || details.name,
            posterPath: details.poster_path,
            voteAverage: details.vote_average,
            releaseDate: details.release_date || details.first_air_date
        });
        toast.success(isFav ? "Додано до улюблених" : "Видалено з улюблених");
    };

    const handleToggleWatchLater = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!details || !type) return;
        toggleWatchLater({
            id: details.id,
            type: type as ContentType,
            title: details.title || details.name,
            posterUrl: details.poster_path,
            releaseDate: details.release_date || details.first_air_date
        });
        toast.success(isWatchLater ? "Додано до списку «На потім»" : "Видалено зі списку «На потім»");
    };


    // DEMO: currentUser (замініть на реального користувача з контексту)
    const currentUser = localStorage.getItem('username') || null;
    // DEMO: comments (можна замінити на API)
    const [comments, setComments] = useState<any[]>(() => {
        const saved = localStorage.getItem(`comments_${id}`);
        return saved ? JSON.parse(saved) : [];
    });
    // Rating logic (зберігаємо всі оцінки)
    const [ratings, setRatings] = useState<{ user: string, rating: number }[]>(() => {
        const saved = localStorage.getItem(`ratings_${id}`);
        return saved ? JSON.parse(saved) : [];
    });
    const userKey = currentUser || localStorage.getItem('guestName') || 'anonymous';
    const userRating = ratings.find(r => r.user === userKey)?.rating || 0;
    const average = ratings.length ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    const handleRatingChange = (val: number) => {
        let updated;
        if (ratings.some(r => r.user === userKey)) {
            updated = ratings.map(r => r.user === userKey ? { ...r, rating: val } : r);
        } else {
            updated = [...ratings, { user: userKey, rating: val }];
        }
        setRatings(updated);
        localStorage.setItem(`ratings_${id}`, JSON.stringify(updated));
    };

    const handleEditComment = (edited: any) => {
        const updated = comments.map(c => c.id === edited.id ? edited : c);
        setComments(updated);
        localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    };

    const handleDeleteComment = (commentId: number) => {
        const updated = comments.filter(c => c.id !== commentId);
        setComments(updated);
        localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    };
    const handleAddComment = (comment: any) => {
        const updated = [comment, ...comments];
        setComments(updated);
        localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    };


    // Прокрутка вгору при зміні id
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!id || !type) {
            setError(t("details.invalid_url"));
            setLoading(false);
            return;
        }

        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                // Деталі
                const detailsData = await fetchContentDetails(type, id, language);
                setDetails(detailsData);

                // Додаємо в історію переглядів
                try {
                    addToHistory({ id: detailsData.id, type: type, poster_path: detailsData.poster_path || null });
                } catch (err) {
                    // nothing
                }

                // Відео
                const videosData = await fetchContentVideos(type, id, language);
                setVideos(videosData);

                // Схожі
                const similarData = await fetchSimilarContent(type, id, language);
                setSimilar(similarData);
            } catch (err) {
                console.error(err);
                setError(t("details.not_found"));
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [type, id, language, t]); // залежність від мови!

    if (loading) {
        return (
            <GradientLoader />
        );
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-400 text-xl">
                {error || t("details.not_found")}
            </div>
        );
    }

    const title = details.title || details.name || t("details.unknown_title");
    const year = (details.release_date || details.first_air_date || "").slice(0, 4) || t("common.unknown");

    // Runtime calculation
    let runtime = null;
    if (type === "movie" && details.runtime) {
        const h = Math.floor(details.runtime / 60);
        const m = details.runtime % 60;
        runtime = h > 0 ? `${h}h ${m}m` : `${m}m`;
    } else if (type === "tv" && details.episode_run_time && details.episode_run_time.length > 0) {
        runtime = `${details.episode_run_time[0]}m`;
    }


    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* Кнопка Назад */}
            <div className="absolute top-8 left-8 z-30">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-full transition-all shadow-2xl border border-gray-800 hover:border-gray-600"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t("common.back")}
                </button>
            </div>

            <div className="relative h-[70vh] md:h-[80vh] min-h-[500px]">
                {/* Фоновий зображення / плейсхолдер */}
                {details.backdrop_path ? (
                    <img
                        src={`${TMDB_BACKDROP_BASE}${details.backdrop_path}`}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.85]"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center text-gray-500 text-xl">
                        {t("details.no_backdrop") || "Фон відсутній"}
                    </div>
                )}

                {/* Градієнт затемнення (зверху і знизу сильніше) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 via-40% to-transparent/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

                {/* Контейнер з контентом (назва + рейтинг + кнопки) */}
                <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
                        {/* Ліва частина: назва + метадані */}
                        <div className="flex-1">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl leading-tight text-white">
                                {title}
                            </h1>

                            <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-6 text-lg md:text-2xl text-gray-200 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">★</span>
                                    {details.vote_average?.toFixed(1) || "—"}
                                </div>
                                <span>•</span>
                                <span>{year}</span>
                                {runtime && (
                                    <>
                                        <span>•</span>
                                        <span>{runtime}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Права частина: кнопки дій */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <button
                                onClick={handleToggleFavorite}
                                className={`
            group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full
            backdrop-blur-xl border border-white/20 shadow-2xl
            transition-all duration-300 hover:scale-110 active:scale-95
            ${isFav
                                        ? "bg-gradient-to-br from-rose-600 to-pink-600 shadow-rose-900/60"
                                        : "bg-black/60 hover:bg-black/80"}
          `}
                                title={isFav ? "Видалити з улюблених" : "Додати до улюблених"}
                            >
                                <Heart
                                    size={28}
                                    className={`transition-transform duration-300 ${isFav ? "fill-white scale-110" : "text-white/90 group-hover:scale-110"}`}
                                />
                            </button>

                            <button
                                onClick={handleToggleWatchLater}
                                className={`
            group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full
            backdrop-blur-xl border border-white/20 shadow-2xl
            transition-all duration-300 hover:scale-110 active:scale-95
            ${isWatchLater
                                        ? "bg-gradient-to-br from-indigo-600 to-blue-600 shadow-indigo-900/60"
                                        : "bg-black/60 hover:bg-black/80"}
          `}
                                title={isWatchLater ? "Видалити з «На потім»" : "Додати до «На потім»"}
                            >
                                <Clock
                                    size={28}
                                    className={`transition-transform duration-300 ${isWatchLater ? "text-white scale-110" : "text-white/90 group-hover:scale-110"}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Основний контент */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                    <div className="flex flex-col items-center gap-4">
                        {details.poster_path ? (
                            <img
                                src={`${TMDB_IMG_BASE}${details.poster_path}`}
                                alt={title}
                                className="rounded-3xl shadow-2xl w-full"
                            />
                        ) : (
                            <div className="w-full aspect-[2/3] bg-gray-800 rounded-3xl flex items-center justify-center text-gray-500">
                                {t("common.poster_missing")}
                            </div>
                        )}
                        {/* Rating Section directly under poster */}
                        <div className="mb-2 flex flex-col items-center justify-center">
                            <MinimalRating
                                average={average}
                                userRating={userRating}
                                onRate={handleRatingChange}
                                editable={true}
                            />
                            <span className="text-xs text-gray-400 mt-2">{t('details.rating_hint') || 'Середня оцінка, ваша оцінка у дужках'}</span>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold">{t("details.overview")}</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {details.overview || t("details.no_overview")}
                        </p>
                        {/* Відеоплеєр для фільму/серії */}
                        {details.videoUrl && (
                            <VideoPlayer src={details.videoUrl} />
                        )}
                    </div>
                </div>

                {/* Трейлери */}
                {videos.length > 0 && (
                    <div className="mb-20">
                        <h2 className="text-4xl font-black mb-10 text-center">{t("details.trailers")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map((v) => (
                                <div key={v.key} className="aspect-video">
                                    <YouTube
                                        videoId={v.key}
                                        opts={{
                                            width: "100%",
                                            height: "100%",
                                            playerVars: { autoplay: 0 },
                                        }}
                                        className="w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Схожі */}
                {similar.length > 0 && (
                    <div>
                        <h2 className="text-4xl font-black mb-10 text-center">{t("details.similar")}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {similar.map((item) => {
                                const itemTitle = item.title || item.name || t("details.unknown_title");
                                const itemType = type; // або можна визначати динамічно, якщо потрібно

                                return (
                                    <Link
                                        key={item.id}
                                        to={`/details/${itemType}/${item.id}`}
                                        className="block hover:scale-105 transition-transform duration-300"
                                    >
                                        <img
                                            src={`${TMDB_IMG_BASE}${item.poster_path}`}
                                            alt={itemTitle}
                                            className="rounded-xl shadow-lg w-full"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* Comments Section */}
                <CommentsSection
                    comments={comments}
                    currentUser={currentUser || undefined}
                    onAddComment={handleAddComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                />
            </div>
        </div>
    );
};

export default MovieDetails;