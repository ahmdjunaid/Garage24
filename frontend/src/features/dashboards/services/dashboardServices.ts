import { ADMIN_BASE_ROUTE, GARAGE_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export type cycleType = "week" | "month" | "year";

export const getAdminDashboardDataApi = (type: cycleType) => {
    return api
        .get(`${ADMIN_BASE_ROUTE}/dashboard?type=${type}`)
        .then(res => res.data)
}

export const getMostBookedGaragesApi = () => {
    return api
        .get(`${ADMIN_BASE_ROUTE}/top-garages`)
        .then(res => res.data)
}

export const getGarageDashboardDataApi = (type: cycleType) => {
    return api
        .get(`${GARAGE_BASE_ROUTE}/dashboard?type=${type}`)
        .then(res => res.data)
}

export const getMostBookedServicesApi = () => {
    return api
        .get(`${GARAGE_BASE_ROUTE}/top-services`)
        .then(res => res.data)
}