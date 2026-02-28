import { Types } from "mongoose";

interface PopulatedService {
  _id: Types.ObjectId;
  name: string;
}

interface PopulatedAppointment {
  _id: Types.ObjectId;
  services: PopulatedService[];
}

interface PopulatedUser {
  _id: Types.ObjectId;
  imageUrl?: string;
  name?: string;
}

interface PopulatedGarage {
  _id: Types.ObjectId;
  name: string;
}

export interface TestimonialDoc {
  _id: Types.ObjectId;
  appointmentId: PopulatedAppointment;
  userId: PopulatedUser;
  garageId: PopulatedGarage;
  rating: number;
  review: string;
}

export interface PaginatedReviewResponse {
  docs: TestimonialDoc[];
  totalDocs: number;
  totalPages: number;
}