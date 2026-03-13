// src/api/AdminApiUser.ts   (або adminUsersApi.ts)
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // axios сам додасть multipart з boundary
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const adminUsersApi = {
  // Отримати всіх
  getAll: async () => {
    const res = await api.get("/users/admin/get-all");
    let data = res.data;
    if (typeof data === "string") data = JSON.parse(data);
    return Array.isArray(data) ? data : [];
  },

  // Отримати одного
  getById: async (id: string) => {
    const res = await api.get(`/users/admin/get-user/${id}`);
    let data = res.data;
    if (typeof data === "string") data = JSON.parse(data);
    return data;
  },

  // Створити
  create: async (payload: {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth?: string;
    roles?: string[];
    avatar?: File | null;
  }) => {
    const fd = new FormData();
    fd.append("userName", payload.userName);
    fd.append("email", payload.email);
    fd.append("password", payload.password);
    fd.append("confirmPassword", payload.confirmPassword);
    if (payload.dateOfBirth) fd.append("dateOfBirth", payload.dateOfBirth);
    if (payload.avatar) fd.append("avatar", payload.avatar);
    payload.roles?.forEach((role) => fd.append("roles", role));

    return api.post("/users/admin/create", fd);
  },

  // Оновити (часткове або повне)
  update: async (
    id: string,
    payload: {
      userName?: string;
      email?: string;
      dateOfBirth?: string;
      avatar?: File | null;
      roles?: string[];
      isBlocked?: boolean;
    }
  ) => {
    const fd = new FormData();

    if (payload.userName !== undefined) fd.append("userName", payload.userName);
    if (payload.email !== undefined) fd.append("email", payload.email);
    if (payload.dateOfBirth !== undefined) fd.append("dateOfBirth", payload.dateOfBirth);
    if (payload.avatar !== undefined && payload.avatar) fd.append("avatar", payload.avatar);
    if (payload.roles !== undefined) {
      payload.roles.forEach((role) => fd.append("roles", role));
    }
    if (payload.isBlocked !== undefined) {
      fd.append("isBlocked", payload.isBlocked.toString());
    }

    // Якщо нічого не передали — помилка (або просто пропустити, залежно від бекенду)
    if ([...fd.entries()].length === 0) {
      throw new Error("Немає даних для оновлення");
    }

    return api.put(`/users/admin/update/${id}`, fd);
  },

  // Видалити
  delete: async (id: string) => {
    return api.delete(`/users/admin/delete/${id}`);
  },

  // Окремий метод для блокування/розблокування (зручніше)
  setBlocked: async (id: string, isBlocked: boolean) => {
    return adminUsersApi.update(id, { isBlocked });
  },
};