import axios from "axios";
import { logout, setAccessToken } from "../redux/slice/userSlice";
import { store } from "../redux/store/store";
import { logoutApi } from "./auth";
import { errorToast } from "../utils/notificationAudio";
import { AUTH_BASE_ROUTE } from "../constants/apiRoutes";

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
      error.response?.data?.message === "This account is blocked by Admin."
    ) {
      errorToast("This account is blocked by Admin.");
      setTimeout(async () => {
        await logoutApi();
        store.dispatch(logout());
      }, 2000);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post(`/${AUTH_BASE_ROUTE}/refresh-token`);

        const newAccessToken = response.data.accessToken;
        if(newAccessToken){
          store.dispatch(setAccessToken(newAccessToken));
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (Refresherror) {
        console.error("Refresh token failed", Refresherror);
        errorToast("Refresh token failed");
        setTimeout(async () => {
          await logoutApi();
          store.dispatch(logout());
        }, 2000);
        return Promise.reject(Refresherror);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
