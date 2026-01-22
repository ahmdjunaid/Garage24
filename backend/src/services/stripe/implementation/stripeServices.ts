import { ICheckoutSession } from "../../../types/plan";
import { stripe } from "../../../config/stripe";
import IStripeService from "../interface/IStripeService";
import Stripe from "stripe";
import { IRetriveSessionData } from "../../../types/subscription";

export class StripeService implements IStripeService {
  constructor() {}

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
