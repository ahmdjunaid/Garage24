import {
  GARAGE_BASE_ROUTE,
  MECHANIC_BASE_ROUTE,
  USER_BASE_ROUTE,
} from "@/constants/apiRoutes";
import api from "@/services/api";
import type {
  AppointmentServiceStatus,
  CreateAppointmentRequest,
  ReschedulePayload,
} from "@/types/AppointmentTypes";

export const getAvailableSlotsByGarageId = (garageId: string, date: string) => {
  return api
    .get(
      `/${USER_BASE_ROUTE}/slots/available?garageId=${garageId}&date=${date}`,
    )
    .then((res) => res.data);
};

export const bookAppointmentApi = (data: CreateAppointmentRequest) => {
  return api
    .post(`/${USER_BASE_ROUTE}/appointment/book`, data)
    .then((res) => res.data);
};

export const getAppointmentDetails = (appointmentId: string) => {
  return api
    .get(`/${USER_BASE_ROUTE}/appointment/success/${appointmentId}`)
    .then((res) => res.data);
};

export const getAllAppointmentByUserIdApi = (
  page = 1,
  limit = 5,
  searchQuery = "",
) => {
  return api
    .get(
      `/${USER_BASE_ROUTE}/appointment?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};

export const cancelAppointmentApi = (appointmentId: string) => {
  return api
    .patch(`/${USER_BASE_ROUTE}/appointment/cancel/${appointmentId}`)
    .then((res) => res.data);
};

export const getAppointmentForRescheduleApi = (appointmentId: string) => {
  return api
    .get(`/${USER_BASE_ROUTE}/appointment/reschedule/${appointmentId}`)
    .then((res) => res.data);
};

export const rescheduleAppointmentApi = (
  appointmentId: string,
  data: ReschedulePayload,
) => {
  return api
    .post(`/${USER_BASE_ROUTE}/appointment/reschedule/${appointmentId}`, data)
    .then((res) => res.data);
};

export const getAppointmentMetaData = () => {
  return api
    .get(`${USER_BASE_ROUTE}/appointment/page-meta`)
    .then((res) => res.data);
};

export const fetchAddressForAppointmentApi = (lat: number, lng: number) => {
  return api
    .get(`/${USER_BASE_ROUTE}/get-address?lat=${lat}&lng=${lng}`)
    .then((res) => res.data);
};

export const fetchCoordinatedForAppointmentApi = (name: string) => {
  return api
    .get(`/${USER_BASE_ROUTE}/get-coordinates?name=${name}`)
    .then((res) => res.data);
};

export const fetchNearByGaragesApi = (lat: number, lng: number) => {
  return api
    .get(`/${USER_BASE_ROUTE}/garages/nearby?lat=${lat}&lng=${lng}`)
    .then((res) => res.data);
};

export const fetchServicesByGarageIdApi = (
  garageId: string,
  category: string,
) => {
  return api
    .get(
      `/${USER_BASE_ROUTE}/services/available?garageId=${garageId}&categoryId=${category}`,
    )
    .then((res) => res.data);
};

export const getAppointmentsbyMechIdApi = (
  page = 1,
  limit = 5,
  searchQuery = "",
) => {
  return api
    .get(
      `/${MECHANIC_BASE_ROUTE}/appointments?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};

export const updateServiceStatusApi = (
  appointmentId: string,
  serviceId: string,
  status: AppointmentServiceStatus,
) => {
  return api
    .patch(`/${MECHANIC_BASE_ROUTE}/service-status`, {
      appointmentId,
      serviceId,
      status,
    })
    .then((res) => res.data);
};

export const getActiveAppointmentsApi = (
  page = 1,
  limit = 5,
  searchQuery = "",
) => {
  return api
    .get(
      `${GARAGE_BASE_ROUTE}/appointments?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};
