import { Types, UpdateResult } from "mongoose";
import { Chat, ChatDocument, IChat } from "../../../models/chat";
import { IChatDatas } from "../../../types/chat";
import { BaseRepository } from "../../IBaseRepository";
import {
  IChatRepository,
  unreadCountRawType,
} from "../interface/IChatRepository";

export class ChatRepository
  extends BaseRepository<IChat>
  implements IChatRepository
{
  constructor() {
    super(Chat);
  }

  async sendMessage(data: IChatDatas): Promise<ChatDocument> {
    return await this.create(data);
  }

  async getMessages(appointmentId: string): Promise<ChatDocument[]> {
    return this.getAll({ appointmentId });
  }

  async getUnreadCount(
    ids: Types.ObjectId[],
    currentUID: string
  ): Promise<unreadCountRawType[]> {
    const convertedUserId = new Types.ObjectId(currentUID);
    return await this.model.aggregate([
      {
        $match: {
          appointmentId: { $in: ids },
          readBy: { $ne: convertedUserId },
        },
      },
      {
        $group: {
          _id: "$appointmentId",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async markAsRead(
    appointmentId: string,
    currentUID: string
  ): Promise<UpdateResult> {
    const convertedUserId = new Types.ObjectId(currentUID);
    return await this.model.updateMany(
      {
        appointmentId,
        readBy: { $ne: convertedUserId },
      },
      {
        $addToSet: { readBy: convertedUserId },
      }
    );
  }
}
