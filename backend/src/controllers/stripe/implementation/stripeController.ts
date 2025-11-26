import { Request, Response } from "express";
import IStripeController from "../interface/IStripeController";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  PAYMENT_DETAILS_ERROR,
  SERVER_ERROR,
  WEBHOOK_ERROR,
} from "../../../constants/messages";
import IStripeService from "../../../services/stripe/interface/IStripeService";
import { stripe } from "../../../config/stripe";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";

@injectable()
export class StripeController implements IStripeController {
  constructor(
    @inject(TYPES.StripeService) private _stripeService: IStripeService
  ) {}

  createSubscribeSession = async (req: Request, res: Response) => {
    try {
      const { planId, planName, planPrice } = req.body;
      const garageId = req.user?.id;

      if (!garageId || !planId || !planName || !planPrice) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: ALL_FIELDS_REQUIRED,
        };
      }

      const session = await this._stripeService.createSubscribeSession({
        planId,
        planName,
        planPrice,
        garageId,
      });
      res.status(HttpStatus.OK).json(session);
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || SERVER_ERROR });
    }
  };

  handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      throw { status: HttpStatus.BAD_REQUEST, message: WEBHOOK_ERROR };
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
      const err = error as Error;
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: err.message || SERVER_ERROR });
    }
  };

  getCheckoutSession = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: PAYMENT_DETAILS_ERROR,
        };
      }

      const response = await this._stripeService.retriveDetails(sessionId)

      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || SERVER_ERROR });
    }
  }
}
