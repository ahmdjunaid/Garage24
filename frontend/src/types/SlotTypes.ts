export interface ISlots {
  _id: string;
  garageId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  capacity: number;
  bookedCount: number;
  isReleased: boolean;
  releaseType: "advance" | "same-day";
}