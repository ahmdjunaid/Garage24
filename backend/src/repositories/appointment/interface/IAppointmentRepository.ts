import { ClientSession, ObjectId, Types, UpdateQuery } from "mongoose";
import { AppointmentDocument } from "../../../models/appointment";
import {
  GetMappedAppointmentResponse,
  GetMappedPopulatedAppointmentResponse,
  IAppointment,
  PopulatedAppointmentData,
} from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";
import {
  AppointmentAggregateOnStatus,
  DashboardAggregationResult,
  MostBookedGarage,
  MostBookedServices,
} from "../../../types/dashboard";

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

  assignMechanic(
    appointmentId: string,
    mechanicId: string
  ): Promise<AppointmentDocument | null>;

  updateServiceStatus(
    appointmentId: string,
    serviceId: string,
    status: string
  ): Promise<AppointmentDocument | null>;

  getAllAppointmentByMechId(
    query: GetPaginationQuery
  ): Promise<GetMappedPopulatedAppointmentResponse>;

  aggregateDashboardData(
    start: Date,
    end: Date,
    type: "week" | "month" | "year",
    filters?: {
      garageUID?: Types.ObjectId;
      mechanicId?: Types.ObjectId;
    }
  ): Promise<DashboardAggregationResult>;

  getMostBookedGaragesIds(limit: number): Promise<MostBookedGarage[]>;

  aggregateAppointmentOnStatus(
    start: Date,
    end: Date,
    filters?: {
      garageUID?: Types.ObjectId;
      mechanicId?: Types.ObjectId;
    }
  ): Promise<AppointmentAggregateOnStatus>;

  getMostBookedServices(garageId:string, limit: number): Promise<MostBookedServices[]>;
}
