import { AppointmentDocument } from "../../../models/appointment";
import {
  CreateAppointmentRequest,
  GetMappedAppointmentResponse,
  GetMappedPopulatedAppointmentResponse,
  PopulatedAppointmentData,
  ReschedulePayload,
} from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";

export interface IAppointmentService {
  createAppointment(
    userId: string,
    payload: CreateAppointmentRequest
  ): Promise<AppointmentDocument>;
  getActiveAppointments(
    query: GetPaginationQuery
  ): Promise<GetMappedAppointmentResponse>;
  getAppointmentDetails(
    appointmentId: string
  ): Promise<PopulatedAppointmentData | null>;
  getAllAppointmentsByUserId(
    query: GetPaginationQuery
  ): Promise<GetMappedPopulatedAppointmentResponse>;
  cancelAppointment(id: string): Promise<AppointmentDocument | null>;
  getAppointmentForReschedule(id:string): Promise<PopulatedAppointmentData | null>;
  rescheduleAppointment(id: string, payload: ReschedulePayload): Promise<AppointmentDocument | null>;
}
