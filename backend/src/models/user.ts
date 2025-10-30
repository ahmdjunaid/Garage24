import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    Id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String },
    age: { type: Number },
    gender: { type: String },
    mobileNumber: { type: String },
    role: { type: String, enum: ["user", "garage", "mechanic", "admin"] },
    isBlocked: { type: Boolean, default: false },
    password: { type: String },
    googleID: { type: String },
    isDeleted: { type: Boolean, default: false },
    isOnboardingRequired: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export type UserDocument = IUser & Document;
const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
