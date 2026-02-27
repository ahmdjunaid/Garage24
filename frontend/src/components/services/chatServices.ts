import { CHAT_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export const getUnreadCountApi = () => {
  return api.get(`${CHAT_BASE_ROUTE}/unread-count`).then((res) => res.data);
};
