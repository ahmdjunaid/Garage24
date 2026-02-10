import type { PlanData } from "@/features/subscription/modals/AddPlans";
import { ADMIN_BASE_ROUTE, GARAGE_BASE_ROUTE, STRIPE_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";
import type { IPlan } from "@/types/PlanTypes";

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

export const subscribePlanApi = (data: {
  planId: string;
  planName: string;
  planPrice: number;
}) => {
  return api
    .post(`/${GARAGE_BASE_ROUTE}/create-subscribe-session`, data)
    .then((res) => res.data);
};

export const retriveTransactionApi = (sessionId: string) => {
  return api
    .get(`/${STRIPE_BASE_ROUTE}/session/${sessionId}`)
    .then((res) => res.data);
};

export const getCurrentSubscriptionApi = (garageId: string) => {
  return api
    .get(`/${GARAGE_BASE_ROUTE}/get-current-plan/${garageId}`)
    .then((res) => res.data);
};

export const fetchGarageStatusApi = () => {
  return api.get(`/${GARAGE_BASE_ROUTE}/get-status`).then((res) => res.data);
};

export const fetchAllPlansForGarageApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${GARAGE_BASE_ROUTE}/plans?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};