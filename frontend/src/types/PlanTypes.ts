export interface IPlan {
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}