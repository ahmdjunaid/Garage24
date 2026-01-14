import { Types } from "mongoose";

export interface ISlot {
  garageId: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;

  capacity: number;
  bookedCount: number;

  isReleased: boolean;
  releaseType: "advance" | "same-day";
}