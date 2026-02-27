import { ChatDocument } from "../../../models/chat";
import { AppointmentDocForChat, AppointmentFilterForChat, IChatDatas } from "../../../types/chat";

export interface IChatService {
    sendMessage(data: IChatDatas): Promise<ChatDocument>;
    getParticipants(appointmentId:string): Promise<string[]>;
    getAppointmentsForChat(query: AppointmentFilterForChat): Promise<AppointmentDocForChat[]>;
    getMessages(appointmentId:string): Promise<ChatDocument[]>
    getAppointmentsForChatById(appointmentId: string): Promise<AppointmentDocForChat|null>;
}