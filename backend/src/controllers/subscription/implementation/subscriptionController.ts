import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";
import ISubscriptionController from "../interface/ISubscriptionController";
import ISubscriptionService from "../../../services/subscription/interface/ISubscriptionService";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService
  ) {}

  subscribePlan = async (
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
      const session = await this._subscriptionService.subscribePlan({
        garageId,
        planId,
        planName,
        planPrice
      });

      res.status(HttpStatus.OK).json(session);
    } catch (error) {
      next(error);
    }
  };
}
