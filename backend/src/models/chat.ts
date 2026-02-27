import mongoose, { Schema, HydratedDocument } from "mongoose";

export interface IChat {
  appointmentId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: "customer" | "garage" | "mechanic";
  message: string;
  readBy: mongoose.Types.ObjectId[];
}

const chatMessageSchema = new Schema<IChat>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["customer", "garage", "mechanic"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

chatMessageSchema.index({ appointmentId: 1 });

export type ChatDocument = HydratedDocument<IChat>;
export const Chat = mongoose.model("Chat", chatMessageSchema);
