import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IPaymentService from "../interface/IPaymentService";
import { IPaymentRepository } from "../../../repositories/payment/interface/IPaymentRepositories";
import { generateCustomId } from "../../../utils/generateUniqueIds";
import { BillType } from "../../../types/payments";
import { Types } from "mongoose";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.paymentRepository)
    private _paymentRepository: IPaymentRepository
  ) {}
  async create(data: {
    userId: Types.ObjectId;
    sessionId: string;
    paymentIntentId: string;
    BillType: BillType;
    referenceId: Types.ObjectId;
    amount: number;
  }) {
    const transactionId = generateCustomId("transaction");
    await this._paymentRepository.create({...data,transactionId});
    return {message: "Payment completed successfull"}
  }
}
