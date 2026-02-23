import { ADMIN_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export type cycleType = "week" | "month" | "year";

export const getAdminDashboardData = (type: cycleType) => {
    return api
        .get(`${ADMIN_BASE_ROUTE}/dashboard?type=${type}`)
        .then(res => res.data)
}