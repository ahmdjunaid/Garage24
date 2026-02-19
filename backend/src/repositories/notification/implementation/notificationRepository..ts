import { BaseRepository } from "../../IBaseRepository";
import { INotificationRepository } from "../interface/INotificationRepository";
import {
  INotification,
  Notification,
  NotificationDocument,
} from "../../../models/notification";

export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async createNotification(data: Partial<INotification>) {
    return await this.create(data);
  }

  async getNotificationByUserId(
    userId: string
  ): Promise<NotificationDocument[]> {
    return this.getAll({ recipientId: userId, isRead: false });
  }
}
