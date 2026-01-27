import { AppointmentDocument } from "../../../models/appointment";
import { CreateAppointmentRequest, GetMappedAppointmentResponse } from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";

export interface IAppointmentService {
  createAppointment(userId:string, payload: CreateAppointmentRequest): Promise<AppointmentDocument>;
  getActiveAppointments(query:GetPaginationQuery):Promise<GetMappedAppointmentResponse>
}