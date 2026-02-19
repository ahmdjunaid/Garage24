import { inject, injectable } from "inversify";
import {
  INotification,
  NotificationDocument,
} from "../../../models/notification";
import { INotificationService } from "../interface/INotificationService";
import { TYPES } from "../../../DI/types";
import { INotificationRepository } from "../../../repositories/notification/interface/INotificationRepository";
import { getIO } from "../../../socket/soket";

@injectable()
export class NotificationService implements INotificationService {

  constructor(
    @inject(TYPES.NotificationRepository)
    private _notificationRepository: INotificationRepository,
  ) {}
  async createNotification(data: INotification): Promise<NotificationDocument> {
    const notification =
      await this._notificationRepository.createNotification(data);
    this.emitNotification(notification);
    return notification;
  }

  async getNotificationByUserId(
    userId: string
  ): Promise<NotificationDocument[]> {
    return await this._notificationRepository.getNotificationByUserId(userId);
  }

  private emitNotification(data: NotificationDocument): void {
    if (!data.recipientId) return;
    
    const io = getIO();
    io.to(data.recipientId.toString()).emit("notification", data);
  }
}
