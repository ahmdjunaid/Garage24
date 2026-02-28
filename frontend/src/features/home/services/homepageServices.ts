import { USER_BASE_ROUTE } from "@/constants/apiRoutes"
import api from "@/services/api"

export const fetchPaginatedTestimonials = (page:number, limit:number) => {
    return api
        .get(`${USER_BASE_ROUTE}/home/testimonials?page=${page}&limit=${limit}`)
        .then(res => res.data)
}