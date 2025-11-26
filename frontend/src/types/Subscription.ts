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
  transactionId: string;
  startDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  paymentHistory: IPaymentHistory;
  __v?: number;
}