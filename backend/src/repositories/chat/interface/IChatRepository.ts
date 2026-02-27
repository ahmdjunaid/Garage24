import { ChatDocument } from "../../../models/chat";
import { IChatDatas } from "../../../types/chat";

export interface IChatRepository {
  sendMessage(data: IChatDatas): Promise<ChatDocument>;
  getMessages(appointmentId:string): Promise<ChatDocument[]>;
}