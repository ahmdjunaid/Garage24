import { Appointment, AppointmentDocument } from "../../../models/appointment";
import {
  GetMappedAppointmentResponse,
  IAppointment,
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
    data: Partial<IAppointment>
  ): Promise<AppointmentDocument> {
    return await this.model.create(data);
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
}
