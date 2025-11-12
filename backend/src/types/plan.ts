export interface IPlan extends Document {
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetMappedPlanResponse {
  plans: IPlan[];
  totalPlans: number;
  totalPages: number;
}

export interface ICheckoutSession {
  garageId: string;
  planId: string;
  planName: string;
  planPrice: number;
}
