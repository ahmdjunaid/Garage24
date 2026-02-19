import { INotification, NotificationDocument } from "../../../models/notification";

export interface INotificationService {
    createNotification(data: INotification):Promise<NotificationDocument>;
    getNotificationByUserId(userId: string): Promise<NotificationDocument[]>;
}