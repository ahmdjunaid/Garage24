import mongoose, { Schema } from "mongoose";
import { IMechanic } from "../types/mechanic"

const mechanicSchema = new Schema<IMechanic>(
  {
    name: { type: String },
    garageId: { type: Schema.Types.ObjectId , ref: "User"},
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    skills: {type: [String]},
    imageUrl: { type: String },
    mobileNumber: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export const Mechanic = mongoose.model<IMechanic>("Mechanic", mechanicSchema);