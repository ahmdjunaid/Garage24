import cron from "node-cron";
import { SubscriptionService } from "../services/subscription/implimentation/subscriptionService";
import logger from "../config/logger";

export const startSubscriptionActivationJob = (
  _subscriptionService: SubscriptionService
) => {
  cron.schedule("* * * * *", async () => {
    try {
      await _subscriptionService.activePendingSubscriptions();
    } catch (error) {
      logger.error("Subscription activation job failed", error);
    }
  });
};