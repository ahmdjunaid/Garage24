import { AxiosError } from "axios";
import api from "./api";
import { GOOGLE_CALLBACK_URL } from "../constants/apiRoutes";

export const SignUpApi = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await api.post(`/auth/signup`, data);
    const user = response.data;

    return user;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("SignUp Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const loginApi = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post(`/auth/login`, data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Login error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const verifyOtpApi = async (data: { email: string; otp: string }) => {
  try {
    const response = await api.post(`/auth/verify-otp`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Verify-Otp error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const logoutApi = async () => {
  try {
    await api.post("/auth/logout");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Logout error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const forgotPasswordApi = async (data: { email: string }) => {
  try {
    await api.post("/auth/forgot-password", data);
    return { success: true, message: "Otp sent to email address." };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Forgotpassword error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resendOtpApi = async (data: { email: string }) => {
  try {
    const response = await api.post(`/auth/resend-otp`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resetPasswordApi = async (data: { email: string, password: string}, token: string ) => {
  console.log(data, token, 'From reset api')
  try {
    await api.post("/auth/reset-password", data,
      {headers: {AuthorizationToken: `Bearer ${token}`}}
    );

    return { success: true, message: "Password reset successful. Please login with your new credentials." };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Reset password error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const googleLoginApi = async (credentialResponse: any) => {
  try {
    const accessToken = credentialResponse.access_token;

    const res = await api.post(GOOGLE_CALLBACK_URL, {
      accessToken,
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};
