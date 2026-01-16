import { AppointmentDocument } from "../../../models/appointment";
import { CreateAppointmentDTO, GetMappedAppointmentResponse } from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";

export interface IAppointmentService {
  createAppointment(
    payload: CreateAppointmentDTO
  ): Promise<AppointmentDocument>;
  getActiveAppointments(query:GetPaginationQuery):Promise<GetMappedAppointmentResponse>
}