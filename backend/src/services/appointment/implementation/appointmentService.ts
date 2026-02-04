import { inject, injectable } from "inversify";
import { IAppointmentService } from "../interface/IAppointmentService";
import { AppointmentDocument } from "../../../models/appointment";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import {
  CreateAppointmentRequest,
  GetMappedAppointmentResponse,
  GetMappedPopulatedAppointmentResponse,
  PopulatedAppointmentData,
  ReschedulePayload,
} from "../../../types/appointment";
import mongoose, { Types } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import { ISlotService } from "../../slot/interface/ISlotService";
import { calculateEndTime } from "../../../utils/calculateEndTime";
import { buildVehicleSnapshot } from "../../../utils/buildVehicleSnapshot";
import HttpStatus from "../../../constants/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandler";
import { generateCustomId } from "../../../utils/generateUniqueIds";

@injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository,
    @inject(TYPES.SlotService) private _slotService: ISlotService
  ) {}

  async createAppointment(
    userId: string,
    payload: CreateAppointmentRequest
  ): Promise<AppointmentDocument> {
    await this._slotService.lockSlots(payload.slotIds);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this._slotService.validateSlotCapacity(payload.slotIds, session);

      const endTime = calculateEndTime(
        payload.time.startTime,
        payload.totalDuration
      );    
      
      const APP_ID = generateCustomId("appointment")

      const appointment = await this._appointmentRepository.createAppointment(
        {
          userId: new Types.ObjectId(userId),
          appId: APP_ID,
          garageId: new Types.ObjectId(payload.garage),
          garageUID: new Types.ObjectId(payload.garageUID),
          slotIds: payload.slotIds.map((id) => new Types.ObjectId(id)),
          appointmentDate: new Date(payload.date),
          startTime: payload.time.startTime,
          endTime,
          serviceIds: payload.services.map((s) => new Types.ObjectId(s._id)),
          totalDuration: payload.totalDuration,
          status: "confirmed",
          paymentStatus: "pending",
          vehicle: buildVehicleSnapshot(payload.vehicleData),
          userData: payload.userData,
        },
        session
      );

      await this._slotService.incrementBookedCount(payload.slotIds, session);

      await session.commitTransaction();
      session.endSession();

      await this._slotService.releaseSlots(payload.slotIds);

      return appointment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this._slotService.releaseSlots(payload.slotIds);

      throw error;
    }
  }

  async getActiveAppointments(
    query: GetPaginationQuery
  ): Promise<GetMappedAppointmentResponse> {
    const response =
      await this._appointmentRepository.getActiveAppointments(query);

    const mappedResponse = {
      appointments: response.appointments,
      totalAppointments: response.totalAppointments,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async getAppointmentDetails(
    appointmentId: string
  ): Promise<PopulatedAppointmentData | null> {
    return await this._appointmentRepository.getAppointmentById(appointmentId);
  }

  async getAllAppointmentsByUserId(
    query: GetPaginationQuery
  ): Promise<GetMappedPopulatedAppointmentResponse> {
    return await this._appointmentRepository.getAllAppointmentByUserId(query);
  }

  async cancelAppointment(id: string): Promise<AppointmentDocument> {
    const appointment =
      await this._appointmentRepository.getAppointmentById(id);

    if (
      appointment?.status !== "pending" &&
      appointment?.status !== "confirmed"
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Cannot be cancelled at this stage."
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cancelledAppointment =
        await this._appointmentRepository.findByIdAndUpdate(
          id,
          { status: "cancelled" },
          { session, new: true }
        );

      if (!cancelledAppointment) {
        throw new AppError(HttpStatus.NOT_FOUND, "Appointment not found");
      }

      if (cancelledAppointment.status !== "cancelled") {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Appointment cannot be cancelled"
        );
      }

      await this._slotService.decrementBookedCount(
        cancelledAppointment.slotIds.map((slotId) => slotId.toString()),
        session
      );

      await session.commitTransaction();

      return cancelledAppointment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAppointmentForReschedule(
    id: string
  ): Promise<PopulatedAppointmentData | null> {
    const appointment =
      await this._appointmentRepository.getAppointmentForReschedule(id);
    if (!appointment) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "This appointment cannot be rescheduled at this stage."
      );
    }

    return appointment;
  }

  async rescheduleAppointment(id: string, payload: ReschedulePayload) {
    await this._slotService.lockSlots(payload.slotIds);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this._slotService.validateSlotCapacity(payload.slotIds, session);
      const endTime = calculateEndTime(payload.startTime, payload.duration);
      const appointment = await this._appointmentRepository.findByIdAndUpdate(
        id,
        {
          slotIds: payload.slotIds,
          startTime: payload.startTime,
          appointmentDate: new Date(payload.date),
          endTime,
        },
        { session, new: true }
      );

      await this._slotService.incrementBookedCount(payload.slotIds, session);
      await this._slotService.decrementBookedCount(payload.releasableSlotIds, session)
      await session.commitTransaction();
      session.endSession();

      await this._slotService.releaseSlots(payload.slotIds);

      return appointment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this._slotService.releaseSlots(payload.slotIds);

      throw error;
    }
  }
}
