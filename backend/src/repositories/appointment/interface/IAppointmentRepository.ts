import { ClientSession, UpdateQuery } from "mongoose";
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
  getAllAppointmentByUserId(
    query: GetPaginationQuery
  ): Promise<GetMappedPopulatedAppointmentResponse>;
  findByIdAndUpdate(
    id: string,
    update: UpdateQuery<IAppointment>,
    options?: {
      session?: ClientSession;
      new?: boolean;
    }
  ): Promise<AppointmentDocument | null>;
  getAppointmentForReschedule(
    id: string
  ): Promise<PopulatedAppointmentData | null>;
  pushToArray<T>(
    appointmentId: string,
    field: "services" | "events",
    data: T,
    options?: {
      session?: ClientSession;
      new?: boolean;
    }
  ): Promise<AppointmentDocument | null>;
  assignMechanic(appointmentId:string, mechanicId:string): Promise<AppointmentDocument | null>;
  updateServiceStatus(appointmentId:string, serviceId:string, status:string): Promise<AppointmentDocument | null>;
  getAllAppointmentByMechId(query: GetPaginationQuery): Promise<GetMappedPopulatedAppointmentResponse>
}
