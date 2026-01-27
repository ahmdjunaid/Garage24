import { Types } from "mongoose";

export interface ISlot {
  garageId: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;

  durationInMinutes: number;
  capacity: number;
  bookedCount: number;

  isReleased: boolean;
  releaseType: "advance" | "same-day";
}