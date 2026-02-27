import { Types } from "mongoose";
import { ChatDocument } from "../../../models/chat";
import { IChatDatas } from "../../../types/chat";
import { UpdateResult } from "mongoose";

export interface IChatRepository {
  sendMessage(data: IChatDatas): Promise<ChatDocument>;
  getMessages(appointmentId:string): Promise<ChatDocument[]>;
  getUnreadCount(ids: Types.ObjectId[], currentUID: string): Promise<unreadCountRawType[]>;
  markAsRead(appointmentId:string, currentUID:string): Promise<UpdateResult>;
}

export interface unreadCountRawType {
  _id: Types.ObjectId,
  count: number,
} 