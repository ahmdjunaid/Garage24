import { UpdateResult } from "mongoose";
import { INotification, NotificationDocument } from "../../../models/notification";

export interface INotificationService {
    createNotification(data: INotification):Promise<NotificationDocument>;
    getNotificationByUserId(userId: string): Promise<NotificationDocument[]>;
    markAsRead(notifId: string): Promise<NotificationDocument|null>;
    markAllAsRead(userId: string): Promise<UpdateResult>;
}