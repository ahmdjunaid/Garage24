import { NextFunction, Request, Response } from "express";
import IStripeController from "../interface/IStripeController";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  PAYMENT_DETAILS_ERROR,
  WEBHOOK_ERROR,
} from "../../../constants/messages";
import IStripeService from "../../../services/stripe/interface/IStripeService";
import { stripe } from "../../../config/stripe";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class StripeController implements IStripeController {
  constructor(
    @inject(TYPES.StripeService) private _stripeService: IStripeService
  ) {}

  createSubscribeSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { planId, planName, planPrice } = req.body;
      const garageId = req.user?.id;

      if (!garageId || !planId || !planName || !planPrice) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }
      const session = await this._stripeService.createSubscribeSession({
        planId,
        planName,
        planPrice,
        garageId,
      });

      res.status(HttpStatus.OK).json(session);
    } catch (error) {
      next(error);
    }
  };

  handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      throw new AppError(HttpStatus.BAD_REQUEST, WEBHOOK_ERROR);
    }

    try {
      const webhookSecret = process.env.WEBHOOK_SECRET_KEY || "";
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
      await this._stripeService.handleWebhookEvent(event);
      res.status(HttpStatus.OK).json({ received: true });
    } catch (error) {
      next(error);
    }
  };

  getCheckoutSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        throw new AppError(HttpStatus.BAD_REQUEST, PAYMENT_DETAILS_ERROR);
      }

      const response = await this._stripeService.retriveDetails(sessionId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
