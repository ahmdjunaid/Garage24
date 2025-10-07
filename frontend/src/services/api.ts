import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";
const API_URL = isLocalhost
  ? import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
  : import.meta.env.VITE_P_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = config.headers.AuthorizationToken;
    if (token) {
      config.headers.Authorization = `${token}`;
      delete config.headers.AuthorizationToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Your account is blocked"
    ) {
      console.warn("User is blocked.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        console.log("Refresh response:", response);

        const newAccessToken = response.data.accessToken;
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (Refresherror) {
        console.error("Refresh token failed", Refresherror);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
