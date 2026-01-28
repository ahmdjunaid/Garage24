import { inject, injectable } from "inversify";
import { IAppointmentService } from "../interface/IAppointmentService";
import { AppointmentDocument } from "../../../models/appointment";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import {
  CreateAppointmentRequest,
  GetMappedAppointmentResponse,
  PopulatedAppointmentData,
} from "../../../types/appointment";
import mongoose, { Types } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import { ISlotService } from "../../slot/interface/ISlotService";
import { calculateEndTime } from "../../../utils/calculateEndTime";
import { buildVehicleSnapshot } from "../../../utils/buildVehicleSnapshot";

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
    await this._slotService.validateSlotCapacity(
      payload.slotIds,
      session
    );

    const endTime = calculateEndTime(
      payload.time.startTime,
      payload.totalDuration
    );

    const appointment = await this._appointmentRepository.createAppointment(
      {
        userId: new Types.ObjectId(userId),
        garageId: new Types.ObjectId(payload.garage),
        slotIds: payload.slotIds.map(id => new Types.ObjectId(id)),
        appointmentDate: new Date(payload.date),
        startTime: payload.time.startTime,
        endTime,
        serviceIds: payload.services.map(
          s => new Types.ObjectId(s._id)
        ),
        totalDuration: payload.totalDuration,
        status: "pending",
        paymentStatus: "pending",
        vehicle: buildVehicleSnapshot(payload.vehicleData),
        userData: payload.userData
      },
      session
    );

    await this._slotService.incrementBookedCount(
      payload.slotIds,
      session
    );

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

  async getAppointmentDetails(appointmentId: string): Promise<PopulatedAppointmentData | null> {
    return await this._appointmentRepository.getAppointmentById(appointmentId)
  }
}
