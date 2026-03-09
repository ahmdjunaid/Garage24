import { ClientSession, Types, UpdateQuery } from "mongoose";
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
import {
  AppointmentDocForChat,
  AppointmentFilterForChat,
} from "../../../types/chat";
import { AppointmentReportResponse } from "../../../types/reports";

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
    status: string,
    skipReason: string
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

  getMostBookedServices(
    garageId: string,
    limit: number
  ): Promise<MostBookedServices[]>;

  getParticipants(appointmentId: string): Promise<string[]>;
  getAppointmentsForChat(
    query: AppointmentFilterForChat
  ): Promise<AppointmentDocForChat[]>;
  getAppointmentsForChatById(
    appointmentId: string
  ): Promise<AppointmentDocForChat | null>;
  getAppointmentsIdsForChat(currentUID: string): Promise<Types.ObjectId[]>;
  getAppointmentDoc(appointmentId: string): Promise<AppointmentDocument | null>;
  insertRating(
    appointmentId: Types.ObjectId,
    rating: number
  ): Promise<AppointmentDocument | null>;
  getAppointmentByVehicleNum(
    query: GetPaginationQuery,
    filters: AppointmentFilterForChat
  ): Promise<GetMappedPopulatedAppointmentResponse>;
  getAppointmentReport(
    startDate: string,
    endDate: string,
    garageId?: string,
    page?: number,
    limit?: number
  ): Promise<AppointmentReportResponse>;
}
