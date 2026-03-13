import api from "./Api";
import { toast } from "react-hot-toast";

export const getMyProfile = async () => {
  try {
    const response = await api.get("/users/profile/get");
    console.log("GET профіль:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Помилка getMyProfile:", error);
    if (error.response?.status === 401) {
      toast.error("Сесія закінчилась. Увійдіть повторно.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 404) {
      toast.error("GET ендпоінт не знайдено — перевір шлях /users/profile/get");
    }
    throw error;
  }
};

export const updateMyProfile = async (formData: FormData) => {
  try {
    const response = await api.put("/users/profile/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Успішне оновлення:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Помилка updateMyProfile:", error.response?.data || error);

    let message = "Не вдалося оновити профіль";

    if (error.response?.status === 404) {
      message = "404 — перевір шлях: використовуй '/users/profile/update' (без /api/)";
    } else if (error.response?.status === 400) {
      message = error.response.data?.message || "Неправильні дані (UserId/Username/DateOfBirth/Image)";
    } else if (error.response?.status === 401) {
      message = "Не авторизовано — перевір токен";
    } else if (error.response?.status === 413) {
      message = "Файл занадто великий";
    } else if (error.response?.status === 500) {
      message = "Помилка сервера (500) — перевір логи бекенду";
    }

    toast.error(message);
    throw error;
  }
};