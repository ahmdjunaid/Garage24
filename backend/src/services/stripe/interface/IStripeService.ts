import { ICheckoutSession, IRetriveSessionData } from "../../../types/subscription";

export default interface IStripeService {
  createCheckoutSession(data: ICheckoutSession):Promise<{ url: string }>;
  retriveDetails(sessionId: string):Promise<IRetriveSessionData | null>
}