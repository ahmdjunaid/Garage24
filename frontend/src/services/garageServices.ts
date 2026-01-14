import api from "./api";
import { GARAGE_BASE_ROUTE, STRIPE_BASE_ROUTE } from "../constants/apiRoutes";
import type { IService } from "@/types/ServicesTypes";

export const onboardingApi = (data: FormData) => {
  return api
    .post(`/${GARAGE_BASE_ROUTE}/onboarding`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const registerMechanicApi = (data: {
  name: string;
  email: string;
  role: string;
}) => {
  return api
    .post(`/${GARAGE_BASE_ROUTE}/register-mechanic`, data)
    .then((res) => res.data);
};

export const fetchAddressApi = (lat: number, lng: number) => {
  return api
    .get(`/${GARAGE_BASE_ROUTE}/get-address?lat=${lat}&lng=${lng}`)
    .then((res) => res.data);
};

export const fetchMechanicsApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${GARAGE_BASE_ROUTE}/mechanics?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};

export const toggleUserStatusApi = (userId: string, action: string) => {
  return api
    .patch(`/${GARAGE_BASE_ROUTE}/mechanic/${userId}`, { action: action })
    .then((res) => res.data);
};

export const deleteMechanic = (userId: string) => {
  return api
    .delete(`/${GARAGE_BASE_ROUTE}/mechanic/${userId}`)
    .then((res) => res.data);
};

export const fetchGarageStatusApi = () => {
  return api.get(`/${GARAGE_BASE_ROUTE}/get-status`).then((res) => res.data);
};

export const fetchAllPlansApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${GARAGE_BASE_ROUTE}/plans?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};

export const resendInvitation = (id: string) => {
  return api
    .post(`/${GARAGE_BASE_ROUTE}/resend-invitation/${id}`)
    .then((res) => res.data);
};

export const subscribePlanApi = (data: {
  planId: string;
  planName: string;
  planPrice: number;
}) => {
  return api
    .post(`/${STRIPE_BASE_ROUTE}/create-subscribe-session`, data)
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

export const createServiceApi = (data: Partial<IService>) => {
  return api
    .post(`${GARAGE_BASE_ROUTE}/services`, data)
    .then((res) => res.data);
};

export const fetchAllServicesApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${GARAGE_BASE_ROUTE}/services?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
    )
    .then((res) => res.data);
};

export const toggleServiceStatusApi = (serviceId:string, action:string) => {
  return api
    .patch(`/${GARAGE_BASE_ROUTE}/services/${serviceId}`,{action})
    .then(res => res.data)
}

export const deleteServiceApi = (serviceId:string) => {
  return api
    .delete(`/${GARAGE_BASE_ROUTE}/services/${serviceId}`)
    .then(res => res.data)
}

export const getGarageDetailsApi = (garageId:string) => {
  return api
    .get(`/${GARAGE_BASE_ROUTE}/get-garage?garageId=${garageId}`)
    .then(res => res.data)
}

export const getAllServiceCatoriesApi = () => {
  return api
    .get(`${GARAGE_BASE_ROUTE}/service-categories`)
    .then(res => res.data)
}