import { CHAT_BASE_ROUTE } from "@/constants/apiRoutes"
import api from "@/services/api"

export const fetchApptsByMechIdForChatApi = (mechanicId:string) =>{
    return api
        .get(`${CHAT_BASE_ROUTE}/appointments?mechanicId=${mechanicId}`)
        .then(res => res.data)
}

export const fetchApptsByGarageIdForChatApi = (garageId:string) =>{
    return api
        .get(`${CHAT_BASE_ROUTE}/appointments?garageId=${garageId}`)
        .then(res => res.data)
}

export const fetchMessagesByAppIdApi = (appointmentId:string) =>{
    return api
        .get(`${CHAT_BASE_ROUTE}/messages/${appointmentId}`)
        .then(res => res.data)
}