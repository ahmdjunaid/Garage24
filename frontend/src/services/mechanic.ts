import { AxiosError } from "axios";
import api from "./api";
import { MECHANIC_BASE_ROUTE } from "../constants/apiRoutes";

export const onboardingMechanicApi = async (
  data: FormData,
  token: string | null
) => {
  try {
    const response = await api.post(`/${MECHANIC_BASE_ROUTE}/onboarding`, data, {
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




