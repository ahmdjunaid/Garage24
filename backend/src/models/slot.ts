import { HydratedDocument, Schema, model } from "mongoose";
import { ISlot } from "../types/slots";

const slotSchema = new Schema<ISlot>(
  {
    garageId: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
      required: true
    },
    date: { type: String, required: true },
    startTime: String,
    endTime: String,

    capacity: Number,
    bookedCount: { type: Number, default: 0 },

    isReleased: { type: Boolean, default: true },
    releaseType: {
      type: String,
      enum: ["advance", "same-day"],
      default: "advance"
    }
  },
  { timestamps: true }
);

slotSchema.index(
  { garageId: 1, date: 1, startTime: 1 },
  { unique: true }
);

export const Slot = model<ISlot>("Slot", slotSchema);
export type SlotDocument = HydratedDocument<ISlot>;
