import { ADMIN_BASE_ROUTE, GARAGE_BASE_ROUTE } from "@/constants/apiRoutes";
import api from "@/services/api";

//Garage
export const getAppointmentReport = (
  startDate: string,
  endDate: string,
  page = 1,
  limit = 6,
) => {
  return api
    .get(
      `${GARAGE_BASE_ROUTE}/appointment/report?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
    )
    .then((res) => res.data);
};

export const downloadAppointmentReportPDF = (
  startDate: string,
  endDate: string
) => {
  return api.get(
    `${GARAGE_BASE_ROUTE}/appointment/report/pdf?startDate=${startDate}&endDate=${endDate}`,
    {
      responseType: "blob",
    }
  );
};

export const downloadAppointmentReportExcel = (
  startDate: string,
  endDate: string
) => {
  return api.get(
    `${GARAGE_BASE_ROUTE}/appointment/report/excel?startDate=${startDate}&endDate=${endDate}`,
    {
      responseType: "blob",
    }
  );
};

//Admin
export const getAppointmentReportAdminApi = (
  startDate: string,
  endDate: string,
  page = 1,
  limit = 6,
) => {
  return api
    .get(
      `${ADMIN_BASE_ROUTE}/appointment/report?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
    )
    .then((res) => res.data);
};

export const downloadAppointmentReportPDFAdminApi = (
  startDate: string,
  endDate: string
) => {
  return api.get(
    `${ADMIN_BASE_ROUTE}/appointment/report/pdf?startDate=${startDate}&endDate=${endDate}`,
    {
      responseType: "blob",
    }
  );
};

export const downloadAppointmentReportExcelAdminApi = (
  startDate: string,
  endDate: string
) => {
  return api.get(
    `${ADMIN_BASE_ROUTE}/appointment/report/excel?startDate=${startDate}&endDate=${endDate}`,
    {
      responseType: "blob",
    }
  );
};