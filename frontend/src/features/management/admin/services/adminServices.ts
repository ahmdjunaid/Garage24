import api from "../../../../services/api";
import { ADMIN_BASE_ROUTE } from "../../../../constants/apiRoutes";

export const fetchAllUsersApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${ADMIN_BASE_ROUTE}/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};

export const fetchAllGaragesApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${ADMIN_BASE_ROUTE}/garages?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};

export const fetchGarageByIdApi = (garageId: string) => {
  return api
    .get(`/${ADMIN_BASE_ROUTE}/garage?garageId=${garageId}`)
    .then((res) => res.data);
};

export const toggleStatusApi = (userId: string, action: string) => {
  return api
    .patch(`/${ADMIN_BASE_ROUTE}/toggle-status/${userId}`, { action })
    .then((res) => res.data);
};

export const garageApprovalApi = (userId:string, action:string, reason:string) => {
  return api
    .patch(`/${ADMIN_BASE_ROUTE}/garage-approval/${userId}`, { action, reason })
    .then((res) => res.data);
};

export const fetchGarageDetailsByIdApi = (garageId: string) => {
  return api
    .get(`/${ADMIN_BASE_ROUTE}/garage-details?garageId=${garageId}`)
    .then((res) => res.data);
};