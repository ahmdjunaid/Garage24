import { inject, injectable } from "inversify";
import { IAppointmentService } from "../interface/IAppointmentService";
import { AppointmentDocument } from "../../../models/appointment";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import {
  CreateAppointmentDTO,
  GetMappedAppointmentResponse,
} from "../../../types/appointment";
import { Types } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";

@injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository
  ) {}

  async createAppointment(
    payload: CreateAppointmentDTO
  ): Promise<AppointmentDocument> {
    const totalDuration = payload.services.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );

    const serviceIds = payload.services.map((s) => new Types.ObjectId(s._id));

    function addMinutes(time: string, minutes: number): string {
      const [h, m] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(h!, m! + minutes);
      return date.toTimeString().slice(0, 5);
    }

    const endTime = addMinutes(payload.startTime, totalDuration);

    return await this._appointmentRepository.createAppointment({
      userId: new Types.ObjectId(payload.userId),
      garageId: new Types.ObjectId(payload.garageId),

      vehicle: {
        vehicleId: payload.vehicleData._id
          ? new Types.ObjectId(payload.vehicleData._id)
          : undefined,
        licensePlate: payload.vehicleData.licensePlate,
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
      appointmentDate: new Date(payload.appointmentDate),
      startTime: payload.startTime,
      endTime,

      serviceIds,
      totalDuration,

      status: "pending",
      paymentStatus: "pending",
    });
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
