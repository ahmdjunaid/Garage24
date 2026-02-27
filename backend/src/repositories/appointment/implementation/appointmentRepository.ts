import {
  ClientSession,
  FilterQuery,
  ObjectId,
  Types,
  UpdateQuery,
} from "mongoose";
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
import {
  AppointmentAggregateOnStatus,
  DashboardAggregationResult,
  MostBookedGarage,
  MostBookedServices,
} from "../../../types/dashboard";
import { AppointmentDocForChat, AppointmentFilterForChat } from "../../../types/chat";

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

  async aggregateDashboardData(
    start: Date,
    end: Date,
    type: "week" | "month" | "year",
    filters?: {
      garageUID?: Types.ObjectId;
      mechanicId?: Types.ObjectId;
    }
  ): Promise<DashboardAggregationResult> {
    const groupFormat =
      type === "year"
        ? { $month: "$appointmentDate" }
        : type === "month"
          ? { $dayOfMonth: "$appointmentDate" }
          : { $dayOfWeek: "$appointmentDate" };

    const matchStage: FilterQuery<AppointmentDocument> = {
      paymentStatus: "paid",
      appointmentDate: { $gte: start, $lte: end },
    };

    if (filters?.garageUID) {
      matchStage.garageUID = filters.garageUID;
    }

    if (filters?.mechanicId) {
      matchStage.mechanicId = filters.mechanicId;
    }

    const result = await this.model.aggregate([
      { $match: matchStage },
      {
        $facet: {
          revenue: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
          chart: [
            { $group: { _id: groupFormat, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    return result[0];
  }

  async getMostBookedGaragesIds(limit: number): Promise<MostBookedGarage[]> {
    return this.model.aggregate([
      {
        $group: {
          _id: "$garageId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "garages",
          localField: "_id",
          foreignField: "_id",
          as: "garage",
        },
      },
      { $unwind: "$garage" },
      {
        $project: {
          _id: 0,
          garageId: "$_id",
          count: 1,
          name: "$garage.name",
          location: "$garage.address",
          imageUrl: "$garage.imageUrl",
          supportedFuelTypes: "$garage.supportedFuelTypes",
          isBlocked: "$garage.isBlocked",
          isDeleted: "$garage.isDeleted",
        },
      },
    ]);
  }

  async aggregateAppointmentOnStatus(
    start: Date,
    end: Date,
    filters?: { garageUID?: Types.ObjectId; mechanicId?: Types.ObjectId }
  ): Promise<AppointmentAggregateOnStatus> {
    const matchStage: FilterQuery<AppointmentDocument> = {
      appointmentDate: { $gte: start, $lte: end },
    };

    if (filters?.garageUID) {
      matchStage.garageUID = filters.garageUID;
    }

    if (filters?.mechanicId) {
      matchStage.mechanicId = filters.mechanicId;
    }

    const result = await this.model.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalAppointments: [{ $count: "count" }],
          completedAppointments: [
            { $match: { status: "completed" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = result[0];

    return {
      totalAppointments: data.totalAppointments[0]?.count ?? 0,
      completedAppointments: data.completedAppointments[0]?.count ?? 0,
    };
  }

  async getMostBookedServices(
    garageId: string,
    limit: number
  ): Promise<MostBookedServices[]> {
    const objId = new Types.ObjectId(garageId);

    return await this.model.aggregate([
      { $match: { garageUID: objId } },
      { $unwind: "$services" },
      {
        $group: {
          _id: "$services.serviceId",
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "garageservices",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },

      {
        $project: {
          _id: 0,
          serviceId: "$_id",
          count: 1,
          name: "$service.name",
          durationMinutes: "$service.durationMinutes",
          isBlocked: "$service.isBlocked",
          isDeleted: "$service.isDeleted",
        },
      },
    ]);
  }

  async getParticipants(appointmentId: string): Promise<string[]> {
    const appointment = await this.model.findById(appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const participants = [
      appointment.userId,
      appointment.garageUID,
      appointment.mechanicId,
    ].filter((id): id is Types.ObjectId => Boolean(id));

    return participants.map((id) => id.toString());
  }

  async getAppointmentsForChat(
    query: AppointmentFilterForChat
  ): Promise<AppointmentDocForChat[]> {
    const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];
    
    const filter:FilterQuery<AppointmentDocument> = {
      status: { $in: ACTIVE_STATUSES }
    };

    if (query?.garageUID) {
      filter.garageUID = query.garageUID;
    }

    if (query?.mechanicId) {
      filter.mechanicId = query.mechanicId;
    }

    const appointments = await this.model
      .find(filter)
      .select("_id vehicle.licensePlate vehicle.make.name vehicle.model.name status appointmentDate")
      .lean();

    return appointments as unknown as AppointmentDocForChat[]
  }

    async getAppointmentsForChatById(
    appointmentId: string
  ): Promise<AppointmentDocForChat|null> {
    const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];
    
    const filter:FilterQuery<AppointmentDocument> = {
      _id: appointmentId,
      status: { $in: ACTIVE_STATUSES }
    };

    const appointments = await this.model
      .findOne(filter)
      .select("_id vehicle.licensePlate vehicle.make.name vehicle.model.name status appointmentDate")
      .lean();

    return appointments as unknown as AppointmentDocForChat | null
  }
}