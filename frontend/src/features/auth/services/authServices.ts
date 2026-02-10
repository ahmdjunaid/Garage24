import api from "../../../services/api";
import { AUTH_BASE_ROUTE } from "../../../constants/apiRoutes";
const GOOGLE_CALLBACK_URL = import.meta.env.VITE_GOOGLE_CALLBACK_URL;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: "Bearer";
}

export const signUpApi = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  return api.post(`/${AUTH_BASE_ROUTE}/signup`, data).then((res) => res.data);
};

export const loginApi = (data: { email: string; password: string }) => {
  return api.post(`/${AUTH_BASE_ROUTE}/login`, data).then((res) => res.data);
};

export const verifyOtpApi = (data: {
  email: string;
  otp: string;
  context: "register" | "other";
}) => {
  return api
    .post(`/${AUTH_BASE_ROUTE}/verify-otp`, data)
    .then((res) => res.data);
};

export const logoutApi = async () => {
  return api.post(`/${AUTH_BASE_ROUTE}/logout`).then((res) => res.data);
};

export const forgotPasswordApi = (data: { email: string }) => {
  return api
    .post(`/${AUTH_BASE_ROUTE}/forgot-password`, data)
    .then((res) => res.data);
};

export const resendOtpApi = (data: {
  email: string;
  context: "register" | "other";
}) => {
  return api
    .post(`/${AUTH_BASE_ROUTE}/resend-otp`, data)
    .then((res) => res.data);
};

export const resetPasswordApi = (data: { email: string; password: string }) => {
  return api
    .post(`/${AUTH_BASE_ROUTE}/reset-password`, data)
    .then((res) => res.data);
};

export const googleLoginApi = (credentialResponse: TokenResponse) => {
  return api
    .post(GOOGLE_CALLBACK_URL, { accessToken: credentialResponse.access_token })
    .then((res) => res.data);
};
