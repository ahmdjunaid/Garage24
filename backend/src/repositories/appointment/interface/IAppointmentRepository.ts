import { ClientSession } from "mongoose";
import { AppointmentDocument } from "../../../models/appointment";
import {
  GetMappedAppointmentResponse,
  GetMappedPopulatedAppointmentResponse,
  IAppointment,
  PopulatedAppointmentData,
} from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";

export interface IAppointmentRepository {
  createAppointment(
    data: Partial<IAppointment>,
    session: ClientSession
  ): Promise<AppointmentDocument>;
  getActiveAppointments(
    query: GetPaginationQuery
  ): Promise<GetMappedAppointmentResponse>;
  getAppointmentById(id: string): Promise<PopulatedAppointmentData | null>;
  getAllAppointmentByUserId(query:GetPaginationQuery): Promise<GetMappedPopulatedAppointmentResponse>;
}
