import { IPayment } from "../../../types/payments";
import { PaymentDocument } from "../../../models/payments";

export interface IPaymentRepository {
  create(data: Partial<IPayment>): Promise<PaymentDocument>;
}
