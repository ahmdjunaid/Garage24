import { INotification, NotificationDocument } from "../../../models/notification";

export interface INotificationRepository {
    createNotification(data: INotification): Promise<NotificationDocument>
    getNotificationByUserId(userId: string): Promise<NotificationDocument[]>
}