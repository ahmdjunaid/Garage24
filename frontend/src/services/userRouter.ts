import { USER_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "./api";

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
  return api
    .get(`${USER_BASE_ROUTE}/vehicles`)
    .then((res) => res.data);
};


export const getAllBrandsApi = () => {
  return api
    .get(`${USER_BASE_ROUTE}/brands`)
    .then(res => res.data)
}

export const getVehicleModelsByBrandApi = (brandId:string) => {
  return api
    .get(`${USER_BASE_ROUTE}/${brandId}/vehicle-models`)
    .then(res => res.data)
}

export const getVehicleDetailsById = (vehicleId:string) => {
    return api
      .get(`${USER_BASE_ROUTE}/vehicle?vehicleId:${vehicleId}`)
      .then(res => res.data)
}

export const getAppointmentMetaData = () => {
    return api
      .get(`${USER_BASE_ROUTE}/appointment/page-meta`)
      .then(res => res.data)
}
