import { stripe } from "../../../config/stripe";
import IStripeService from "../interface/IStripeService";
import Stripe from "stripe";
import { ICheckoutSession, IRetriveSessionData } from "../../../types/subscription";

export class StripeService implements IStripeService {
  constructor() {}

  async createCheckoutSession(data: ICheckoutSession) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: data.currency ?? "inr",
            product_data: { name: data.productName },
            unit_amount: data.amount * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: data.metadata
      },
      metadata: data.metadata,
      mode: "payment",
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
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
      productName: session.metadata?.productName || "Unknown Product",
      paymentMethod: paymentIntent.payment_method_types?.[0] || "Unknown",
      date: paymentIntent.created
        ? new Date(paymentIntent.created * 1000)
        : new Date(),
      receipt_url: charge.receipt_url || null,
    };
  }
}
