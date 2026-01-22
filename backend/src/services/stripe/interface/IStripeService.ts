import { ICheckoutSession } from "../../../types/plan";
import { IRetriveSessionData } from "../../../types/subscription";

export default interface IStripeService {
  createSubscribeSession(data: ICheckoutSession):Promise<{ url: string }>;
  retriveDetails(sessionId: string):Promise<IRetriveSessionData | null>
}