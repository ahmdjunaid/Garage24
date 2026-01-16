export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IAppointmentVehicleSnapshot {
  vehicleId?: string;
  licensePlate?: string;
  registrationYear?: number;
  fuelType?: string;
  variant?: string;
  color?: string;

  make: {
    _id: string;
    name: string;
  };

  model: {
    _id: string;
    name: string;
  };

  imageUrl?: string;
}


export interface IAppointment {
  userId: string;
  garageId: string;

  vehicle: IAppointmentVehicleSnapshot;

  slotIds: string[];
  appointmentDate: Date;
  startTime: string;
  endTime: string;

  serviceIds: string[];
  totalDuration: number;

  mechanicId?: string;
  mechanicAssignedAt?: Date;

  paymentId?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  amount?: number;

  status: AppointmentStatus;

  cancellationReason?: string;
  customerNote?: string;
  mechanicNote?: string;
}
