import { Types } from "mongoose";
import { ISlot } from "../types/slots";

const IST_OFFSET_MINUTES = 5 * 60 + 30;

export const createSlotsForDay = ({
  garageId,
  date,
  openingTime,
  closingTime,
  slotDuration,
  capacity,
}: {
  garageId: string;
  date: Date;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  capacity: number;
}): ISlot[] => {
  const slots: ISlot[] = [];

  const toMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      h! < 0 ||
      h! > 23 ||
      m! < 0 ||
      m! > 59
    ) {
      throw new Error(`Invalid time value: ${time}`);
    }
    return h! * 60 + m!;
  };

  const toTimeString = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const roundUpToSlot = (minutes: number, duration: number): number =>
    Math.ceil(minutes / duration) * duration;

  const getCurrentMinutesIST = (): number => {
    const now = new Date();
    return now.getUTCHours() * 60 + now.getUTCMinutes() + IST_OFFSET_MINUTES;
  };

  const isSameISTDay = (a: Date, b: Date): boolean => {
    const aIST = new Date(a.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
    const bIST = new Date(b.getTime() + IST_OFFSET_MINUTES * 60 * 1000);

    return (
      aIST.getFullYear() === bIST.getFullYear() &&
      aIST.getMonth() === bIST.getMonth() &&
      aIST.getDate() === bIST.getDate()
    );
  };

  const slotDate = new Date(date);
  slotDate.setUTCHours(18, 30, 0, 0);

  let current = toMinutes(openingTime);
  const end = toMinutes(closingTime);

  if (isSameISTDay(slotDate, new Date())) {
    const nowIST = getCurrentMinutesIST();
    const roundedNow = roundUpToSlot(nowIST, slotDuration);
    current = Math.max(current, roundedNow);

    if (current >= end) {
      return [];
    }
  }

  while (current + slotDuration <= end) {
    slots.push({
      garageId: new Types.ObjectId(garageId),
      date: slotDate,
      startTime: toTimeString(current),
      endTime: toTimeString(current + slotDuration),
      durationInMinutes: slotDuration,
      capacity,
      bookedCount: 0,
      isReleased: true,
      releaseType: "advance"
    });

    current += slotDuration;
  }

  return slots;
};
