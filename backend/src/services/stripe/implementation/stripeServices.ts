import { ICheckoutSession } from "../../../types/plan";
import { stripe } from "../../../config/stripe";
import IStripeService from "../interface/IStripeService";
import Stripe from "stripe";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import ISubscriptionService from "../../subscription/interface/ISubscriptionService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { SUBSCRIPTION_ERROR } from "../../../constants/messages";
import { IRetriveSessionData } from "../../../types/subscription";
import IPaymentService from "../../payment/interface/IPaymentService";
import { Types } from "mongoose";

@injectable()
export class StripeService implements IStripeService {
  constructor(
    @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService
  ) {}

  async createSubscribeSession(data: ICheckoutSession) {
    const { garageId, planId, planName, planPrice } = data;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: planName },
            unit_amount: planPrice * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          garageId,
          planId,
          planName,
        },
      },
      metadata: {
        garageId,
        planId,
        planName,
      },
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/garage/plans?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/garage/plans?payment=failed`,
    });

    return { url: session.url! };
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
          throw { status: HttpStatus.BAD_REQUEST, message: SUBSCRIPTION_ERROR };
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

          await this._subscriptionService.upsertPaymentStatus(pi.id, "paid");

          await this._paymentService.create({
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

        // await this._subscriptionService.upsertPaymentStatus(pi.id, "failed");

        await this._paymentService.create({
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

        // await this._subscriptionService.upsertPaymentStatus(
        //   paymentIntentId.toString(),
        //   "failed"
        // );

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  async retriveDetails(sessionId: string): Promise<IRetriveSessionData | null> {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items"],
    });

    if (!session || !session.payment_intent || !session.amount_total) {
      return null;
    }

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const charge = await stripe.charges.retrieve(
      paymentIntent.latest_charge as string
    );

    return {
      transactionId: paymentIntent.id || null,
      amountPaid: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || "INR",
      planName: session.metadata?.planName || "Unknown Plan",
      paymentMethod: paymentIntent.payment_method_types?.[0] || "Unknown",
      date: paymentIntent.created
        ? new Date(paymentIntent.created * 1000)
        : new Date(),
      receipt_url: charge.receipt_url || null,
    };
  }
}
