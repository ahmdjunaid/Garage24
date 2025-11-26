export interface IPlan {
  _id: string;
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

export interface IRetriveSessionData {
    transactionId: string | null;
    planName: string;
    amountPaid: number;
    paymentMethod: string;
    currency: string;
    date: Date;
    receipt_url: string;
}