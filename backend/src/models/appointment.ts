import { Schema, model, HydratedDocument } from "mongoose";
import { IAppointment } from "../types/appointment";

const appointmentSchema = new Schema<IAppointment>(
  {
    appId: { type: String, required: true }, //unique appointment id to UI
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    garageId: { type: Schema.Types.ObjectId, ref: "Garage", required: true },
    garageUID: { type: Schema.Types.ObjectId, ref: "User", required: true},

    vehicle: {
      vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", default: null },
      licensePlate: { type: String },
      registrationYear: { type: Number },
      fuelType: { type: String },
      variant: { type: String },
      color: { type: String },
      imageUrl: { type: String },
      make: { _id: { type: Schema.Types.ObjectId, ref: "Make", required: true }, name: { type: String, required: true }},
      model: { _id: { type: Schema.Types.ObjectId, ref: "Model", required: true }, name: { type: String, required: true }},
    },

    userData: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobileNumber: { type: String, required: true },
    },

    slotIds: [ { type: Schema.Types.ObjectId, ref: "Slot", required: true }],

    appointmentDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalDuration: { type: Number, required: true },

    services: [
      { 
        serviceId: {type: Schema.Types.ObjectId, ref: "GarageService", required: true},
        name: {type: String, required:true},
        price: {type:Number, required:true},
        durationMinutes: {type:Number, required:true},
        status: {type:String, enum: ["pending","started","completed","skipped"], default: "pending"},
        startedAt: {type: Date},
        completedAt: {type: Date},
      }
    ],


    mechanicId: { type: Schema.Types.ObjectId, ref: "Mechanic", default: null },
    mechanicAssignedAt: { type: Date, default: null },

    amount: { type: Number, default: null },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", default: null },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending"},
    stripePaymentIntentId: { type: String },

    status: { type: String, enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"], default: "pending"},

    events: [
      {
        message: { type: String, required: true },
        doneBy: { type: Schema.Types.ObjectId, required: true },
        actorName: { type: String, required: true },
        actorRole: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ],

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

export type AppointmentDocument = HydratedDocument<IAppointment>;