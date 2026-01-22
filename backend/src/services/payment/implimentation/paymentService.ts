import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IPaymentService from "../interface/IPaymentService";
import { IPaymentRepository } from "../../../repositories/payment/interface/IPaymentRepositories";
import { generateCustomId } from "../../../utils/generateUniqueIds";
import { BillType, PaymentStatus } from "../../../types/payments";
import { Types } from "mongoose";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  SUBSCRIPTION_ERROR,
} from "../../../constants/messages";
import ISubscriptionService from "../../subscription/interface/ISubscriptionService";
import Stripe from "stripe";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.PaymentRepository)
    private _paymentRepository: IPaymentRepository,
    @inject(TYPES.SubscriptionService)
    private _subscriptionService: ISubscriptionService
  ) {}
  async createPayment(data: {
    userId: Types.ObjectId;
    paymentIntentId: string;
    provider: "stripe";
    BillType: BillType;
    referenceId: Types.ObjectId;
    amount: number;
    status: PaymentStatus;
  }) {
    const transactionId = generateCustomId("transaction");
    await this._paymentRepository.create({ ...data, transactionId });
    return { message: "Payment completed successfull" };
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (
          !metadata?.garageId ||
          !metadata?.planId ||
          !session.payment_intent
        ) {
          throw new AppError(HttpStatus.BAD_REQUEST, SUBSCRIPTION_ERROR);
        }

        await this._subscriptionService.upsertPlanData(
          metadata.garageId,
          metadata.planId,
          session.id,
          session.payment_intent.toString()
        );
        break;
      }

      case "payment_intent.succeeded": {
        try {
          const pi = event.data.object as Stripe.PaymentIntent;

          await this._subscriptionService.upsertPaymentStatus(
            pi.id,
            "paid"
          );

          await this.createPayment({
            userId: new Types.ObjectId(pi.metadata.garageId),
            paymentIntentId: pi.id,
            amount: pi.amount / 100,
            BillType: "subscription",
            provider: "stripe",
            referenceId: new Types.ObjectId(pi.metadata.planId),
            status: "paid",
          });
        } catch (error) {
          console.error("ERROR inside payment_intent.succeeded:", error);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;

        await this.createPayment({
          userId: new Types.ObjectId(pi.metadata.garageId),
          paymentIntentId: pi.id,
          amount: pi.amount / 100,
          BillType: "subscription",
          provider: "stripe",
          referenceId: new Types.ObjectId(pi.metadata.planId),
          status: "failed",
        });
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        const paymentIntentId = session.payment_intent;

        if (!paymentIntentId) {
          console.warn("Expired session has no payment_intent:", session.id);
          break;
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
