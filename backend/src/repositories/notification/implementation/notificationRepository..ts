import { BaseRepository } from "../../IBaseRepository";
import { INotificationRepository } from "../interface/INotificationRepository";
import {
  INotification,
  Notification,
  NotificationDocument,
} from "../../../models/notification";
import { UpdateResult } from "mongoose";

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

  async markAsRead(notifId: string): Promise<NotificationDocument | null> {
    return await this.updateById(notifId, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<UpdateResult> {
    return await this.model.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
