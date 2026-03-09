import { inject, injectable } from "inversify";
import { AppointmentReportResponse } from "../../../types/reports";
import { IReportService } from "../interface/IReportService";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository
  ) {}

  async getAppointmentReport(
    startDate: string,
    endDate: string,
    garageId?: string,
    page?: number,
    limit?: number
  ): Promise<AppointmentReportResponse> {
    return  await this._appointmentRepository.getAppointmentReport(
      startDate,
      endDate,
      garageId,
      page,
      limit
    );
  }
}
