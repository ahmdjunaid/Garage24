import { USER_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "./api";
import type { CreateAppointmentRequest, ReschedulePayload } from "@/types/AppointmentTypes";

export const registerVehicleApi = (data: FormData) => {
  return api
    .post(`${USER_BASE_ROUTE}/vehicles`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const getVehiclesByUserIdApi = () => {
  return api.get(`${USER_BASE_ROUTE}/vehicles`).then((res) => res.data);
};

export const getAllBrandsApi = () => {
  return api.get(`${USER_BASE_ROUTE}/brands`).then((res) => res.data);
};

export const getVehicleModelsByBrandApi = (brandId: string) => {
  return api
    .get(`${USER_BASE_ROUTE}/${brandId}/vehicle-models`)
    .then((res) => res.data);
};

export const getVehicleDetailsById = (vehicleId: string) => {
  return api
    .get(`${USER_BASE_ROUTE}/vehicle?vehicleId=${vehicleId}`)
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
