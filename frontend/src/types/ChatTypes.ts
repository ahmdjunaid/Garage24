export type ChatRole = "customer" | "mechanic" | "garage";
export type ChatAppointmentStatus = "pending" | "confirmed" | "in_progress" | "completed";

export interface IChatMessage {
  _id?: string;
  appointmentId: string;
  senderId: string;
  senderRole: ChatRole;
  message: string;
  readBy: string[];
  createdAt?: string | Date;
}

export interface IChatAppointment {
  _id: string;
  vehicle: {
    licensePlate: string;
    make?: { name: string };
    model?: { name: string };
  };
  status: ChatAppointmentStatus;
  appointmentDate: string;
  unreadCount?: number;
}