export interface ActionPayload {
  id: string, name:string, action: string
}

export interface IRetriveSessionData {
    transactionId: string | null;
    productName: string;
    amountPaid: number;
    paymentMethod: string;
    currency: string;
    date: Date;
    receipt_url: string;
}