import { ICheckoutSession } from "../../../types/plan";
import Stripe from "stripe";
import { IRetriveSessionData } from "../../../types/subscription";

export default interface IStripeService {
  createSubscribeSession(data: ICheckoutSession):Promise<{ url: string }>;
  handleWebhookEvent(event: Stripe.Event):Promise<void>;
  retriveDetails(sessionId: string):Promise<IRetriveSessionData | null>
}