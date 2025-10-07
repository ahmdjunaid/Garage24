import { AxiosError } from "axios";
import api from "./api";
import type { ILocation } from "../types/UserTypes";

export const onboardingApi = async (
  data: {
    garageId?: string;
    location: ILocation;
    plan: string;
    startTime: string;
    endTime: string;
    selectedHolidays: string[];
    image: string | ArrayBuffer | null;
    mobile: string;
    isRSAEnabled: boolean;
  },
  token: string
) => {
  try {
    const response = await api.post(`/garage/onboarding`, data, 
        { headers: { AuthorizationToken: `Bearer ${token}` }}
    );

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

export const registerMechanicApi = async (data: {
  garageId: string | undefined;
  userId: string;
}, token: string | null) => {
  try {
    const response = await api.post('/mechanic/register', data, 
        { headers: { AuthorizationToken: `Bearer ${token}` }}
    )

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
