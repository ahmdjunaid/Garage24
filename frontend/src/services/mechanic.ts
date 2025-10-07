import { AxiosError } from "axios";
import api from "./api";

export const onboardingMechanicApi = async (
  data: {
    userId?: string;
    skills: string[];
    image: string | ArrayBuffer | null;
    mobile: string;
    password: string;
    newPassword: string;
  },
  token: string | null
) => {
  try {
    const response = await api.post(`/mechanic/onboarding`, data, 
        { headers: { AuthorizationToken: `Bearer ${token}` }}
    );

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
