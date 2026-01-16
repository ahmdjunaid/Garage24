import { AppointmentDocument } from "../../../models/appointment";
import { GetMappedAppointmentResponse, IAppointment } from "../../../types/appointment";
import { GetPaginationQuery } from "../../../types/common";

export interface IAppointmentRepository {
    createAppointment(data: Partial<IAppointment>): Promise<AppointmentDocument>;
    getActiveAppointments(query:GetPaginationQuery): Promise<GetMappedAppointmentResponse>
}