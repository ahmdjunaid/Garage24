import { AxiosError } from "axios";
import api from "./api";
import { ADMIN_BASE_ROUTE } from "../constants/apiRoutes";


export const fetchAllUsersApi = async (page = 1, limit = 5, searchQuery =  '',token: string | null) => {
  try {
    const response = await api.get(`/${ADMIN_BASE_ROUTE}/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, {
      headers: { AuthorizationToken: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
 if (error instanceof AxiosError) {
      console.error("Error while fetching users:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const fetchAllGaragesApi = async (page = 1, limit = 5, searchQuery =  '',token: string | null) => {
  try {
    const response = await api.get(`/${ADMIN_BASE_ROUTE}/garages?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, {
      headers: { AuthorizationToken: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
 if (error instanceof AxiosError) {
      console.error("Error while fetching garages:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const toggleStatusApi = async ( userId: string, action: string, token: string | null) => {
  try {
    const response = await api.patch(`/${ADMIN_BASE_ROUTE}/toggle-status/${userId}`, {action: action}, {
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