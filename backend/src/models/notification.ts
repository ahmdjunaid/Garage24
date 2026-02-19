import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface INotification {
  recipientId: Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

export type NotificationDocument = HydratedDocument<INotification>
export const Notification = mongoose.model<INotification>("Notification", notificationSchema)