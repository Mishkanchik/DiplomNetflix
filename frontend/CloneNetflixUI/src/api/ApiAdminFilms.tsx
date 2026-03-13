const BaseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = BaseApi.endsWith('/api') ? BaseApi : `${BaseApi}/api`; // ← фікс дублювання /api

const getJsonHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function multipartRequest(endpoint: string, formData: FormData, method = 'POST') {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // ДЕБАГ: виводимо в консоль, що відправляємо
  console.log(`Відправка ${method} на ${url}`);
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    let errorBody = '';
    try {
      errorBody = await response.text();
      const json = JSON.parse(errorBody);
      errorMessage = json.message || errorMessage;
    } catch {
      errorMessage = errorBody || errorMessage;
    }
    console.error('Сервер відповів помилкою:', response.status, errorMessage);
    throw new Error(`${response.status} ${errorMessage}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function jsonRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...getJsonHeaders(), ...(options.headers as Record<string, string>) },
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch { }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

interface CollectionData {
  name: string;
  description?: string;
}

interface FranchiseData {
  name: string;
  description?: string;
}

interface GenreData {
  name: string;
}

interface EpisodeUpdateData {
  title?: string;
  description?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  videoUrl?: string;
}

export const ApiAdminFilms = {
  // ────────────────────────────────────────────────
  // Collections (JSON)
  // ────────────────────────────────────────────────
  collections: {
    getAll: () => jsonRequest('/collections/get-all'),
    getById: (id: string) => jsonRequest(`/collections/get/${id}`),
    create: (data: CollectionData) => jsonRequest('/collections/create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CollectionData>) => jsonRequest(`/collections/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => jsonRequest(`/collections/delete/${id}`, { method: 'DELETE' }),
  },

  // ────────────────────────────────────────────────
  // Contents (multipart для create/update)
  // ────────────────────────────────────────────────
  contents: {
    createMultipart: (formData: FormData) => multipartRequest('/contents/create', formData),
    updateMultipart: (id: string, formData: FormData) => multipartRequest(`/contents/update/${id}`, formData, 'PUT'),
    delete: (id: string) => jsonRequest(`/contents/delete/${id}`, { method: 'DELETE' }),
    getAll: () => jsonRequest('/contents/get'),
    getById: (id: string) => jsonRequest(`/contents/get-details/${id}`),
  },

  // ────────────────────────────────────────────────
  // Episodes (multipart для add)
  // ────────────────────────────────────────────────
  episodes: {
    addToContentMultipart: (contentId: string, formData: FormData) => multipartRequest(`/episodes/add/${contentId}`, formData),
    delete: (id: string) => jsonRequest(`/episodes/delete/${id}`, { method: 'DELETE' }),
    update: (id: string, data: EpisodeUpdateData) => jsonRequest(`/episodes/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getByContent: (contentId: string) => jsonRequest(`/episodes/get-episodes/content-id/${contentId}`),
    getById: (id: string) => jsonRequest(`/episodes/get/${id}`),
  },

  // ────────────────────────────────────────────────
  // Franchises (JSON)
  // ────────────────────────────────────────────────
  franchises: {
    getAll: () => jsonRequest('/franchises/get-all'),
    getById: (id: string) => jsonRequest(`/franchises/get/${id}`),
    create: (data: FranchiseData) => jsonRequest('/franchises/create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<FranchiseData>) => jsonRequest(`/franchises/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => jsonRequest(`/franchises/delete/${id}`, { method: 'DELETE' }),
  },

  // ────────────────────────────────────────────────
  // Genres (JSON)
  // ────────────────────────────────────────────────
  genres: {
    getAll: () => jsonRequest('/genres/get-all'),
    getById: (id: string) => jsonRequest(`/genres/get/${id}`),
    create: (data: GenreData) => jsonRequest('/genres/create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<GenreData>) => jsonRequest(`/genres/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => jsonRequest(`/genres/delete/${id}`, { method: 'DELETE' }),
  },
};
