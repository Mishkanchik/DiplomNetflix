// src/App.tsx
import "./App.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "./common/UserLayout";
import AuthLayout from "./common/AuthLayout";
import NotFound from "./pages/NotFound";

import PublicHomePage from "./pages/public/LandingPage";
import TermsOfService from "./pages/public/TermsOfService";
import AboutHelp from "./pages/public/AboutHelp";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PasswordRecovery from "./pages/auth/PasswordRecovery";
import NewPassword from "./pages/auth/NewPassword";


import DashboardMovies from "./pages/dashboard/DashboardFilms";
import DashboardAnime from "./pages/dashboard/DashboardAnime";
import DashboardCartoons from "./pages/dashboard/DashboardCartoons";
import Profile from "./pages/dashboard/Profile";
import WatchLater from "./pages/dashboard/WatchLater";
import Favorites from "./pages/dashboard/Favorites";
import WatchHistory from "./pages/dashboard/WatchHistory";
import DashboardSeries from "./pages/dashboard/DashboardSeries";
import WelcomeDashboard from "./pages/dashboard/DashboardMain";
import MovieDetails from "./pages/dashboard/MovieDetails";
import SubscriptionManagement from "./pages/dashboard/SubscriptionManagement";

import AdminUsers from "./pages/admin/AdminUsers";
import { GlobalToaster } from "./lib/toast";
import { LoaderProvider } from "./components/GlobalLoader";
import AdminContents from "./pages/admin/AdminContents";

// ────────────────────────────────────────────────
// Функції перевірки авторизації та ролі
// ────────────────────────────────────────────────

const isAuthenticated = () => !!localStorage.getItem("token");



// ────────────────────────────────────────────────
// Компоненти-обгортки для маршрутів
// ────────────────────────────────────────────────

const ProtectedRoute = ({ selectedGenres, setSelectedGenres, selectedRating, setSelectedRating }: any) => {
  return isAuthenticated()
    ? <UserLayout selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} selectedRating={selectedRating} setSelectedRating={setSelectedRating} />
    : <Navigate to="/login" replace />;
};

const GuestRoute = () => {
  return isAuthenticated()
    ? <Navigate to="/dashboard" replace />
    : <AuthLayout />;
};

const AdminRoute = ({ selectedGenres, setSelectedGenres, selectedRating, setSelectedRating }: any) => {
  console.log("AdminRoute викликався");

  const token = localStorage.getItem("token");
  console.log("Token існує:", !!token);

  if (!token) {
    console.log("Немає токена → редірект на login");
    return <Navigate to="/login" replace />;
  }

  let role = null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    role = payload.role || payload.user?.role || null;
    console.log("Розпарсена роль:", role);
  } catch (err) {
    console.log("Помилка парсингу токена:", err);
  }

  if (role?.toLowerCase() !== "admin") {
    console.log("Роль не admin → редірект на /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("Роль admin → рендеримо children");
  return <UserLayout selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} selectedRating={selectedRating} setSelectedRating={setSelectedRating} />;
};

function App() {
  // Global filter state
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  return (
    <>
      <LoaderProvider>
        <Routes>
          {/* Гостьові маршрути (логін, реєстрація, лендінг тощо) */}
          <Route element={<GuestRoute />}>
            <Route index element={<PublicHomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about-help" element={<AboutHelp />} />
          </Route>

          {/* Захищені маршрути для всіх авторизованих користувачів */}
          <Route element={<ProtectedRoute selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} selectedRating={selectedRating} setSelectedRating={setSelectedRating} />}>
            <Route path="/dashboard" element={<WelcomeDashboard selectedGenres={selectedGenres} selectedRating={selectedRating} />} />
            <Route path="/dashboard-films" element={<DashboardMovies selectedGenres={selectedGenres} selectedRating={selectedRating} />} />
            <Route path="/dashboard-anime" element={<DashboardAnime selectedGenres={selectedGenres} selectedRating={selectedRating} />} />
            <Route path="/dashboard-series" element={<DashboardSeries selectedGenres={selectedGenres} selectedRating={selectedRating} />} />
            <Route path="/dashboard-cartoons" element={<DashboardCartoons selectedGenres={selectedGenres} selectedRating={selectedRating} />} />
            <Route path="/details/:type/:id" element={<MovieDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watch-history" element={<WatchHistory />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/subscriptions" element={<SubscriptionManagement />} />
            <Route path="/about-help" element={<AboutHelp />} />
            <Route path="/dashboard/about-help" element={<AboutHelp />} />

            {/* 404 всередині захищених маршрутів — щоб не показувати гостьовий 404 */}
            <Route path="*" element={<NotFound />} />

          </Route>

          {/* Окремий маршрут ТІЛЬКИ для адмінів */}
          <Route element={<AdminRoute selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} selectedRating={selectedRating} setSelectedRating={setSelectedRating} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/contents" element={<AdminContents />} />
          </Route>

          {/* Глобальний 404 (для неіснуючих шляхів поза захищеними) */}
          <Route path="/reset-password" element={<NewPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <GlobalToaster />
      </LoaderProvider>
    </>
  );
}

export default App;