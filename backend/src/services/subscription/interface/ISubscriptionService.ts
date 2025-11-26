export default interface ISubscriptionService {
  subscribePlan(
    garageId: string,
    planId: string,
    transactionId: string,
  ): Promise<{ message: string; }>;
}