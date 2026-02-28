import mongoose, { HydratedDocument, Types } from "mongoose";

export interface IReview {
    appointmentId: Types.ObjectId;
    userId: Types.ObjectId;
    garageId: Types.ObjectId;
    rating: number;
    review: string;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    garageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
export type ReviewDocument = HydratedDocument<IReview>;