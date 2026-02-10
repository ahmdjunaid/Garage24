import { AUTH_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export const getMeApi = () => {
  return api.get(`/${AUTH_BASE_ROUTE}/me`).then((res) => res.data);
};

export const updateProfileDataApi = (data: FormData) => {
  return api
    .post(`${AUTH_BASE_ROUTE}/profile`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const changePasswordApi = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return api
    .post(`${AUTH_BASE_ROUTE}/change-password`, data)
    .then((res) => res.data);
};