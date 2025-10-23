import { AxiosError } from "axios";
import api from "./api";
import { GARAGE_BASE_ROUTE } from "../constants/apiRoutes";

export const onboardingApi = async (data: FormData, token: string) => {
  try {
    const response = await api.post(`/${GARAGE_BASE_ROUTE}/onboarding`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Onboarding Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const registerMechanicApi = async (
  data: {
    garageId: string | undefined;
    userId: string;
  },
  token: string | null
) => {
  try {
    const response = await api.post(`/${GARAGE_BASE_ROUTE}/register`, data, {
      headers: { AuthorizationToken: `Bearer ${token}` },
    });

    return response.data;
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

export const fetchAddressApi = async (lat: number, lng: number, token: string | null) => {
  try {
    const response = await api.get(`/${GARAGE_BASE_ROUTE}/get-address?lat=${lat}&lng=${lng}`, {
      headers: { AuthorizationToken: `Bearer ${token}` },
    });
    
    return response.data;
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

export const fetchMechanicsApi = async (page = 1, limit = 5, searchQuery =  '',token: string | null) => {
  try {
    const response = await api.get(`/${GARAGE_BASE_ROUTE}/mechanics?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, {
      headers: { AuthorizationToken: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
 if (error instanceof AxiosError) {
      console.error("Error while fetching mechanics:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const toggleUserStatusApi = async ( userId: string, action: string, token: string | null) => {
  try {
    const response = await api.patch(`/${GARAGE_BASE_ROUTE}/mechanic/${userId}`, {action: action}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("toggleUserStatus Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const deleteMechanic = async ( userId: string, token: string | null) => {
  try {
    const response = await api.delete(`/${GARAGE_BASE_ROUTE}/mechanic/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("deleteMechanic Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};