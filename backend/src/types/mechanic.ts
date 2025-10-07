import { ObjectId } from "mongodb";

export interface IMechanic {
  garageId: ObjectId;
  userId: ObjectId;
  skills: string[];
  imageUrl: string;
  mobileNumber: string
}