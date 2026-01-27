import { inject, injectable } from "inversify";
import { IAppointmentService } from "../interface/IAppointmentService";
import { AppointmentDocument } from "../../../models/appointment";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import {
  CreateAppointmentRequest,
  GetMappedAppointmentResponse,
} from "../../../types/appointment";
import mongoose, { Types } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import HttpStatus from "../../../constants/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandler";
import { ISlotService } from "../../slot/interface/ISlotService";
import { calculateEndTime } from "../../../utils/calculateEndTime";
import { normalizePlate } from "../../../utils/normalizeLicencePlate";

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
      const serviceIds = payload.services.map((s) => new Types.ObjectId(s._id));
      const endTime = calculateEndTime(payload.time.startTime, payload.totalDuration);
      const normalizedPlate = normalizePlate(payload.vehicleData.licensePlate)

      const appointment = await this._appointmentRepository.createAppointment({
        userId: new Types.ObjectId(userId),
        garageId: new Types.ObjectId(payload.garage),
  
        vehicle: {
          vehicleId: payload.vehicleData._id
            ? new Types.ObjectId(payload.vehicleData._id)
            : undefined,
          licensePlate: normalizedPlate,
          registrationYear: Number(payload.vehicleData.registrationYear),
          fuelType: payload.vehicleData.fuelType,
          variant: payload.vehicleData.variant,
          color: payload.vehicleData.color,
          imageUrl: payload.vehicleData.imageUrl,
          make: {
            _id: new Types.ObjectId(payload.vehicleData.make._id),
            name: payload.vehicleData.make.name,
          },
          model: {
            _id: new Types.ObjectId(payload.vehicleData.model._id),
            name: payload.vehicleData.model.name,
          },
        },
  
        slotIds: payload.slotIds.map((id) => new Types.ObjectId(id)),
        appointmentDate: new Date(payload.date),
        startTime: payload.time.startTime,
        endTime,
        serviceIds,
        totalDuration:payload.totalDuration,
        status: "pending",
        paymentStatus: "pending",
      }, session);

      await this._slotService.incrementBookedCount(payload.slotIds, session)

      await session.commitTransaction();

      return appointment

    } catch (error) {
      console.error(error)
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
}
