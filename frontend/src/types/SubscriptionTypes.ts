export interface IPaymentHistory {
  amount: number;
  transactionId: string;
  date: string;
  status: 'success' | 'failed' | 'pending';
  reason: string | null;
}

export interface ISubscription {
  _id: string;
  garageId: string;
  planId: string;
  planSnapShot: planSnapShot;
  transactionId: string;
  startDate: string;
  expiryDate: Date;
  createdAt: string;
  updatedAt: string;
  paymentHistory: IPaymentHistory;
  __v?: number;
}

export interface planSnapShot {
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
}