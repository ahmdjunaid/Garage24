import { AxiosError } from "axios";
import api from "./api";
import { GARAGE_BASE_ROUTE } from "../constants/apiRoutes";

export const onboardingApi = async (data: FormData) => {
  try {
    const response = await api.post(`/${GARAGE_BASE_ROUTE}/onboarding`, data, {
      headers: {
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
  }
) => {
  try {
    const response = await api.post(`/${GARAGE_BASE_ROUTE}/register-mechanic`, data);

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

export const fetchAddressApi = async (lat: number, lng: number) => {
  try {
    const response = await api.get(`/${GARAGE_BASE_ROUTE}/get-address?lat=${lat}&lng=${lng}`);
    
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

export const fetchMechanicsApi = async (page = 1, limit = 5, searchQuery =  '',) => {
  try {
    const response = await api.get(`/${GARAGE_BASE_ROUTE}/mechanics?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
    
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

export const toggleUserStatusApi = async ( userId: string, action: string) => {
  try {
    const response = await api.patch(`/${GARAGE_BASE_ROUTE}/mechanic/${userId}`, {action: action});

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

export const deleteMechanic = async ( userId: string) => {
  try {
    const response = await api.delete(`/${GARAGE_BASE_ROUTE}/mechanic/${userId}`);

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

export const fetchGarageStatusApi = async () => {
  try {
    const response = await api.get(`/${GARAGE_BASE_ROUTE}/get-status`);
    return response.data;

  } catch (error) {
 if (error instanceof AxiosError) {
      console.error("Error while fetching:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};