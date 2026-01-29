import { Schema, model, HydratedDocument } from "mongoose";
import { IAppointment } from "../types/appointment";


const appointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    garageId: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    garageUID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      vehicleId: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null,
      },

      licensePlate: { type: String },
      registrationYear: { type: Number },
      fuelType: { type: String },
      variant: { type: String },
      color: { type: String },
      imageUrl: { type: String },

      make: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Make",
          required: true,
        },
        name: { type: String, required: true },
      },

      model: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Model",
          required: true,
        },
        name: { type: String, required: true },
      },
    },
    userData: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobileNumber: { type: String, required: true },
    },

    slotIds: [
      { type: Schema.Types.ObjectId, ref: "Slot", required: true },
    ],

    appointmentDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    serviceIds: [
      { type: Schema.Types.ObjectId, ref: "GarageService", required: true },
    ],

    totalDuration: { type: Number, required: true },

    mechanicId: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },

    mechanicAssignedAt: { type: Date, default: null },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    amount: { type: Number, default: null },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    cancellationReason: { type: String, default: null },
    customerNote: { type: String, default: null },
    mechanicNote: { type: String, default: null },
  },
  { timestamps: true }
);

appointmentSchema.index({ garageId: 1, appointmentDate: 1 });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ mechanicId: 1, appointmentDate: 1 });

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);

export type AppointmentDocument = HydratedDocument<IAppointment>
