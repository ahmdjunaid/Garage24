import { AxiosError } from "axios";
import api from "./api";
import { ADMIN_BASE_ROUTE } from "../constants/apiRoutes";
import type { PlanData } from "../components/modal/AddPlans";

export const fetchAllUsersApi = async (
  page = 1,
  limit = 5,
  searchQuery = ""
) => {
  try {
    const response = await api.get(
      `/${ADMIN_BASE_ROUTE}/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    );

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

export const fetchAllGaragesApi = async (
  page = 1,
  limit = 5,
  searchQuery = ""
) => {
  try {
    const response = await api.get(
      `/${ADMIN_BASE_ROUTE}/garages?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    );

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

export const fetchGarageByIdApi = async (garageId:string) => {
  try {
    const response = await api.get(
      `/${ADMIN_BASE_ROUTE}/garage?garageId=${garageId}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error while fetching garage:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const toggleStatusApi = async (userId: string, action: string) => {
  try {
    const response = await api.patch(
      `/${ADMIN_BASE_ROUTE}/toggle-status/${userId}`,
      { action: action }
    );

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

export const garageApprovalApi = async (userId: string, action: string) => {
  try {
    const response = await api.patch(
      `/${ADMIN_BASE_ROUTE}/garage-approval/${userId}`,
      { action: action }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("garageApproval Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const createPlanApi = async (data: PlanData) => {
  try {
    const response = await api.post(`/${ADMIN_BASE_ROUTE}/create-plan`, data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("createPlanError:", error.response);
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
      `/${ADMIN_BASE_ROUTE}/plans?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
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
