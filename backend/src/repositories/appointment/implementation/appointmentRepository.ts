import { ClientSession, UpdateQuery } from "mongoose";
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
    const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];
    const PREVIOUS_STATUSES = ["completed", "cancelled"];
    const skip = (query.page - 1) * query.limit;
    const searchFilter =
      query.searchQuery === "current"
        ? {
            garageUID: query.id,
            status: { $in: ACTIVE_STATUSES },
          }
        : query.searchQuery === "previous"
          ? {
              garageUID: query.id,
              status: { $in: PREVIOUS_STATUSES },
            }
          : {
              garageUID: query.id,
              status: { $in: ACTIVE_STATUSES },
            };

    const appointments = await this.model
      .find(searchFilter)
      .populate([
        {
          path: "garageId",
          select: "name address mobileNumber location",
        },
        {
          path: "mechanicId",
          select: "name mobileNumber skills",
        },
      ])
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
          path: "mechanicId",
          select: "name mobileNumber skills",
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
          : { status: { $in: ACTIVE_STATUSES } };

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
          path: "mechanicId",
          select: "name mobileNumber skills",
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

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<IAppointment>,
    options?: {
      session?: ClientSession;
      new?: boolean;
    }
  ): Promise<AppointmentDocument | null> {
    return this.model.findByIdAndUpdate(id, update, {
      session: options?.session,
      new: options?.new ?? true,
    });
  }

  async getAppointmentForReschedule(
    id: string
  ): Promise<PopulatedAppointmentData | null> {
    const appointment = await this.model
      .findOne({
        _id: id,
        status: "confirmed",
      })
      .populate([
        {
          path: "garageId",
          select: "name address mobileNumber location",
        },
        {
          path: "mechanicId",
          select: "name mobileNumber skills",
        },
      ]);

    return appointment as unknown as PopulatedAppointmentData;
  }

  async pushToArray<T>(
    appointmentId: string,
    field: "services" | "events",
    data: T,
    options?: {
      session?: ClientSession;
      new?: boolean;
    }
  ): Promise<AppointmentDocument | null> {
    return await this.model.findOneAndUpdate(
      { _id: appointmentId },
      { $push: { [field]: data } },
      { session: options?.session, new: options?.new ?? true }
    );
  }

  async assignMechanic(
    appointmentId: string,
    mechanicId: string
  ): Promise<AppointmentDocument | null> {
    return await this.findByIdAndUpdate(appointmentId, {
      mechanicId,
      mechanicAssignedAt: new Date(),
    });
  }

  async updateServiceStatus(
    appointmentId: string,
    serviceId: string,
    status: string
  ): Promise<AppointmentDocument | null> {
    return await this.model.findOneAndUpdate(
      { _id: appointmentId, "services.serviceId": serviceId },
      {
        $set: {
          "services.$.status": status,
        },
      },
      {
        new: true,
      }
    );
  }

  async getAllAppointmentByMechId(
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
          : { status: { $in: ACTIVE_STATUSES } };

    const filter = {
      mechanicId: query.id,
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
          path: "mechanicId",
          select: "name mobileNumber skills",
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
