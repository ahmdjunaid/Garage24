export interface IService {
  _id: string;
  garageId: string;
  category: string;
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}
