import { USER_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "./api";

export const registerVehicleApi = (data: FormData) => {
  return api
    .post(`${USER_BASE_ROUTE}/vehicles`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};
