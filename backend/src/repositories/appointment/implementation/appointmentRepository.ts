import { ClientSession } from "mongoose";
import { Appointment, AppointmentDocument } from "../../../models/appointment";
import {
  GetMappedAppointmentResponse,
  GetMappedPopulatedAppointmentResponse,
  IAppointment,
  PopulatedAppointmentData,
} from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";
import { BaseRepository } from "../../IBaseRepository";
import { IAppointmentRepository } from "../interface/IAppointmentRepository";

export class AppointmentRepository
  extends BaseRepository<IAppointment>
  implements IAppointmentRepository
{
  constructor() {
    super(Appointment);
  }

  async createAppointment(
    data: Partial<IAppointment>,
    session: ClientSession
  ): Promise<AppointmentDocument> {
    const doc = new this.model(data);
    await doc.save({ session });
    return doc;
  }

  async getActiveAppointments(
    query: GetPaginationQuery
  ): Promise<GetMappedAppointmentResponse> {
    const skip = (query.page - 1) * query.limit;
    const searchFilter = query.searchQuery
      ? {
          name: { $regex: query.searchQuery, $options: "i" },
          userId: query.id,
          status: { $in: ["pending", "confirmed", "in_progress"] },
        }
      : {
          userId: query.id,
          status: { $in: ["pending", "confirmed", "in_progress"] },
        };

    const appointments = await this.model
      .find(searchFilter)
      .skip(skip)
      .limit(query.limit)
      .sort({ createdAt: -1 });

    const totalAppointments = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalAppointments / query.limit);

    return { appointments, totalAppointments, totalPages };
  }

  async getAppointmentById(
    id: string
  ): Promise<PopulatedAppointmentData | null> {
    const appointment = await this.model
      .findById(id)
      .populate([
        {
          path: "garageId",
          select: "name address mobileNumber location",
        },
        {
          path: "serviceIds",
          select: "name price duration",
        },
      ])
      .lean();

    return appointment as unknown as PopulatedAppointmentData;
  }

  async getAllAppointmentByUserId(
    query: GetPaginationQuery
  ): Promise<GetMappedPopulatedAppointmentResponse> {
    const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];
    const PREVIOUS_STATUSES = ["completed", "cancelled"];

    const skip = (query.page - 1) * query.limit;

    const statusFilter =
      query.searchQuery === "current"
        ? { status: { $in: ACTIVE_STATUSES } }
        : query.searchQuery === "previous"
          ? { status: { $in: PREVIOUS_STATUSES } }
          : {};

    const filter = {
      userId: query.id,
      ...statusFilter,
    };

    const appointments = await this.model
      .find(filter)
      .populate([
        {
          path: "garageId",
          select: "name address mobileNumber location",
        },
        {
          path: "serviceIds",
          select: "name price duration",
        },
      ])
      .skip(skip)
      .limit(query.limit)
      .sort({ createdAt: -1 });

    const totalAppointments = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalAppointments / query.limit);

    return {
      appointments: appointments as unknown as PopulatedAppointmentData[],
      totalAppointments,
      totalPages,
    };
  }
}
