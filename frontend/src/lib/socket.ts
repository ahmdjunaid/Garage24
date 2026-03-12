import { io } from "socket.io-client";

const isLocalhost = window.location.hostname === "localhost";
const API_URL =
  isLocalhost === true
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_P_BACKEND_URL;

export const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
});