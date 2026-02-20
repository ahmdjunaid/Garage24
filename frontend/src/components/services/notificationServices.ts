import { NOTIF_BASE_ROUTE } from "@/constants/apiRoutes"
import api from "@/services/api"

export const getNotificationByUserIdApi = () => {
    return api
        .get(`/${NOTIF_BASE_ROUTE}`)
        .then(res => res.data)
}

export const markAsReadApi = (notifId:string) => {
    return api
        .patch(`/${NOTIF_BASE_ROUTE}/${notifId}`)
        .then(res => res.data)
}

export const markAllAsReadApi = () => {
    console.log("hiiii")
    return api
        .patch(`${NOTIF_BASE_ROUTE}`)
        .then(res => res.data)
}