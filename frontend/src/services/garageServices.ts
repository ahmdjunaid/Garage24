import { AxiosError } from "axios";
import api from "./api";
import { GARAGE_BASE_ROUTE, STRIPE_BASE_ROUTE } from "../constants/apiRoutes";

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

export const registerMechanicApi = async (data: {
  name: string;
  email: string;
  role: string;
}) => {
  try {
    const response = await api.post(`/${GARAGE_BASE_ROUTE}/register-mechanic`, data);
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

export const fetchAllPlansApi = async (
  page = 1,
  limit = 5,
  searchQuery = ""
) => {
  try {
    const response = await api.get(
      `/${GARAGE_BASE_ROUTE}/plans?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error while fetching plans:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resendInvitation = async (
  id: string,
) => {
  try {
    const response = await api.post(
      `/${GARAGE_BASE_ROUTE}/resend-invitation/${id}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error while resend", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const subscribePlanApi = async (data:{planId:string, planName:string, planPrice:number}) => {
  try {
    const response = await api.post(
      `/${STRIPE_BASE_ROUTE}/create-subscribe-session`, data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error while create-session", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const retriveTransactionApi = async (sessionId:string) => {
  try {
    const response = await api.get(
      `/${STRIPE_BASE_ROUTE}/session/${sessionId}`);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error while fetching-session", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const getCurrentSubscriptionApi = async (garageId:string) => {
  try {
    const response = await api.get(
      `/${GARAGE_BASE_ROUTE}/get-current-plan/${garageId}`);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error while fetching-currentPln", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};