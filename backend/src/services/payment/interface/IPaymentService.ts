import { IPayment } from "../../../types/payments";

export default interface IPaymentService {
  create(data: Partial<IPayment>): Promise<{ message: string; }>;
}