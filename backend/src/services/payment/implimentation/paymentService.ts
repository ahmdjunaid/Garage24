import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IPaymentService from "../interface/IPaymentService";
import { IPaymentRepository } from "../../../repositories/payment/interface/IPaymentRepositories";
import { generateCustomId } from "../../../utils/generateUniqueIds";
import { BillType, PaymentStatus } from "../../../types/payments";
import { Types } from "mongoose";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { SUBSCRIPTION_ERROR } from "../../../constants/messages";
import ISubscriptionService from "../../subscription/interface/ISubscriptionService";
import Stripe from "stripe";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.PaymentRepository)
    private _paymentRepository: IPaymentRepository,
    @inject(TYPES.SubscriptionService)
    private _subscriptionService: ISubscriptionService,
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository
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
    return await this._paymentRepository.create({ ...data, transactionId });
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        
        if (!metadata?.paymentPurpose || !session.payment_intent) {
          throw new AppError(HttpStatus.BAD_REQUEST, "Invalid Stripe metadata");
        }

        switch (metadata.paymentPurpose) {
          case "SUBSCRIPTION": {
            console.log("2")
            if (!metadata.garageId || !metadata.productId) {
              throw new AppError(HttpStatus.BAD_REQUEST, SUBSCRIPTION_ERROR);
            }

            await this._subscriptionService.upsertPlanData(
              metadata.garageId,
              metadata.productId,
              session.id,
              session.payment_intent.toString()
            );

            await this.createPayment({
              userId: new Types.ObjectId(metadata.garageId),
              paymentIntentId: session.payment_intent.toString(),
              amount: session.amount_total! / 100,
              BillType: "subscription",
              provider: "stripe",
              referenceId: new Types.ObjectId(metadata.planId),
              status: "paid",
            });

            break;
          }

          case "SERVICE_PAYMENT": {
            if (!metadata.appointmentId) {
              throw new AppError(
                HttpStatus.BAD_REQUEST,
                "Appointment ID missing"
              );
            }

            const paymentDoc = await this.createPayment({
              userId: new Types.ObjectId(metadata.userId),
              paymentIntentId: session.payment_intent.toString(),
              amount: session.amount_total! / 100,
              BillType: "service",
              provider: "stripe",
              referenceId: new Types.ObjectId(metadata.appointmentId),
              status: "paid",
            });

            await this._appointmentRepository.findByIdAndUpdate(
              metadata.appointmentId,
              {
                paymentStatus: "paid",
                paymentId: paymentDoc._id.toString(),
                amount: session.amount_total! / 100,
                stripePaymentIntentId: session.payment_intent.toString(),
              }
            );

            break;
          }

          default:
            console.warn("Unknown paymentPurpose:", metadata.paymentPurpose);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;

        if (!pi.metadata?.paymentPurpose) return;

        await this.createPayment({
          userId: new Types.ObjectId(pi.metadata.userId),
          paymentIntentId: pi.id,
          amount: pi.amount / 100,
          BillType:
            pi.metadata.paymentPurpose === "SUBSCRIPTION"
              ? "subscription"
              : "service",
          provider: "stripe",
          referenceId: new Types.ObjectId(
            pi.metadata.planId || pi.metadata.appointmentId
          ),
          status: "failed",
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
