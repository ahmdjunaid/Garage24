import { USER_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export const sendContactEmail = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => {
  return api
    .post(`${USER_BASE_ROUTE}/contact-us`, data)
    .then((res) => res.data);
};
