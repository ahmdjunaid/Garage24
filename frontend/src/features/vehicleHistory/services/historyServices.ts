import { MECHANIC_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

export const fetchAppointmentsByVehicleNumApi = (page = 1, limit = 5, searchQuery = "") => {
  return api
    .get(
      `/${MECHANIC_BASE_ROUTE}/vehicle/appointment?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
    )
    .then((res) => res.data);
};
