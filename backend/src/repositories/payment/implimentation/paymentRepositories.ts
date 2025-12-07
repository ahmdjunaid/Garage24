import {  IPaymentRepository } from "../interface/IPaymentRepositories";
import { injectable } from "inversify";
import { BaseRepository } from "../../IBaseRepository";
import { IPayment } from "../../../types/payments";
import { Payment, PaymentDocument } from "../../../models/payments";

@injectable()
export class paymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(Payment)
  }

  async create(data: Partial<IPayment>): Promise<PaymentDocument> {
    return await this.model.create(data);
  }
  
}
