import { Types } from "mongoose";

export interface IChatDatas {
  appointmentId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "customer" | "garage" | "mechanic"
  message: string;
  readBy: Types.ObjectId[];
}

export interface AppointmentFilterForChat {
  userId?: string;
  garageUID?: string;
  mechanicId?: string;
}

export interface AppointmentDocForChat {
  _id: string;
  vehicle: {
    licensePlate: string;
    make?: { name: string };
    model?: { name: string };
  };
  status: string;
  appointmentDate: string;
}