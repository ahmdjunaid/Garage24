import { GARAGE_BASE_ROUTE, MECHANIC_BASE_ROUTE, USER_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export const fetchAptsByVehicleForMechNumApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${MECHANIC_BASE_ROUTE}/vehicle/appointment?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};

export const fetchAptsByVehicleNumForGarageApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${GARAGE_BASE_ROUTE}/vehicle/appointment?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};

export const fetchAptsByVehicleNumForUserApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${USER_BASE_ROUTE}/vehicle/appointment?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};