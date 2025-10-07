import mongoose, { Schema } from "mongoose";
import { IMechanic } from "../types/mechanic"

const mechanicSchema = new Schema<IMechanic>(
  {
    garageId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    skills: {type: [String]},
    imageUrl: { type: String },
    mobileNumber: { type: String },
  },
  { timestamps: true }
);

export const Mechanic = mongoose.model<IMechanic>("Mechanic", mechanicSchema);