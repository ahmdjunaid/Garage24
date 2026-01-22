import api from "./api";
import { ADMIN_BASE_ROUTE } from "../constants/apiRoutes";
import type { PlanData } from "../components/modal/AddPlans";
import type { IPlan } from "../types/PlanTypes";

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

export const createPlanApi = (data: PlanData) => {
  return api
    .post(`/${ADMIN_BASE_ROUTE}/create-plan`, data)
    .then((res) => res.data);
};

export const fetchAllPlansApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${ADMIN_BASE_ROUTE}/plans?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};

export const togglePlanStatusApi = (planId: string, action: string) => {
  return api
    .patch(`/${ADMIN_BASE_ROUTE}/toggle-plan-status/${planId}`, {
      action: action,
    })
    .then((res) => res.data);
};

export const deletePlansApi = (planId: string) => {
  return api
    .delete(`/${ADMIN_BASE_ROUTE}/delete-plan/${planId}`)
    .then((res) => res.data);
};

export const updatePlanApi = (planId: string, data: Partial<IPlan>) => {
  return api
    .put(`/${ADMIN_BASE_ROUTE}/plans/${planId}`, data)
    .then((res) => res.data);
};

export const getSubscriptionByGarageIdApi = (garageId: string) => {
  return api
    .get(`/${ADMIN_BASE_ROUTE}/get-current-plan/${garageId}`)
    .then((res) => res.data);
};

export const fetchGarageDetailsByIdApi = (garageId: string) => {
  return api
    .get(`/${ADMIN_BASE_ROUTE}/garage-details?garageId=${garageId}`)
    .then((res) => res.data);
};