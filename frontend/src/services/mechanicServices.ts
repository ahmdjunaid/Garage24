import api from "./api";
import { MECHANIC_BASE_ROUTE } from "../constants/apiRoutes";
import type { AppointmentServiceStatus } from "@/types/AppointmentTypes";

export const onboardingMechanicApi = (data: FormData) => {
  return api
    .post(`/${MECHANIC_BASE_ROUTE}/onboarding`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const getAppointmentsbyMechIdApi = (page = 1, limit = 5, searchQuery = "") => {
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
