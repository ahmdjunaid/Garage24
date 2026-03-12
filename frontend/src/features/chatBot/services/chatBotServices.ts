import { USER_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export const chatBotApi = (message: string) => {
  return api
    .post(`${USER_BASE_ROUTE}/chat/bot`, { message })
    .then((res) => res.data)
};
