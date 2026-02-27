import { Chat, ChatDocument, IChat } from "../../../models/chat";
import { IChatDatas } from "../../../types/chat";
import { BaseRepository } from "../../IBaseRepository";
import { IChatRepository } from "../interface/IChatRepository";

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
      return this.getAll({ appointmentId })
  }
}
