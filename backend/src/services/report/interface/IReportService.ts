import { AppointmentReportResponse } from "../../../types/reports";

export interface IReportService {
  getAppointmentReport(
    startDate: string,
    endDate: string,
    garageId?: string,
    page?: number,
    limit?: number
  ): Promise<AppointmentReportResponse>;
}
