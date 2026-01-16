export interface ISlots {
  _id: string;
  garageId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  isReleased: boolean;
  releaseType: "advance" | "same-day";
}