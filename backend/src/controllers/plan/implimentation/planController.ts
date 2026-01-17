import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED } from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IPlanController from "../interface/IPlanController";
import IPlanService from "../../../services/plan/interface/IPlanService";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject(TYPES.PlanService) private _planService: IPlanService) {}

  createPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, validity, noOfMechanics, noOfServices } = req.body;

      if (!name || !price || !validity || !noOfMechanics || !noOfServices) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const data = { name, price, validity, noOfMechanics, noOfServices };

      const message = await this._planService.createPlan(data);

      res.status(HttpStatus.OK).json({ message });
    } catch (error) {
      next(error);
    }
  };

  getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;

      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response = await this._planService.getAllPlans(query);

      res.status(HttpStatus.OK).json({
        plans: response.plans,
        totalPlans: response.totalPlans,
        totalPages: response.totalPages,
      });
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { action } = req.body;
      const planId = req.params.planId;

      if (!planId || !action) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._planService.toggleStatus(planId, action);

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  deletePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const planId = req.params.planId;

      if (!planId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._planService.deletePlan(planId);
      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const planId = req.params.planId;
      const { name, price, validity, noOfMechanics, noOfServices } = req.body;

      if (
        !planId ||
        !name ||
        !price ||
        !validity ||
        !noOfMechanics ||
        !noOfServices
      ) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const message = await this._planService.updatePlan(planId, req.body);

      res.status(HttpStatus.OK).json(message);
    } catch (error) {
      next(error);
    }
  };
}
