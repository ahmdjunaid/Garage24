export interface IService {
  _id: string;
  garageId: string;
  categoryId: string;
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface IServiceResponse {
  _id: string;
  garageId: string;
  categoryName: string;
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}