import axios from "axios";

/**
 * Centralised Axios instance.
 * All API calls use this — base URL comes from .env (VITE_API_URL).
 * The JWT token is injected automatically via request interceptor.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token from localStorage to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser  = (data)  => api.post("/auth/register", data);
export const loginUser     = (data)  => api.post("/auth/login", data);

// ─── Stories ───────────────────────────────────────────────────────────────────
export const fetchStories        = (page = 1, limit = 10) => api.get(`/stories?page=${page}&limit=${limit}`);
export const fetchStoryById      = (id)                   => api.get(`/stories/${id}`);
export const fetchBookmarks      = ()                     => api.get("/stories/bookmarks");
export const toggleBookmarkApi   = (id)                   => api.post(`/stories/${id}/bookmark`);

// ─── Scraper ───────────────────────────────────────────────────────────────────
export const triggerScrape = () => api.post("/scrape");

export default api;
