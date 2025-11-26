import { Request, Response, NextFunction } from "express";
import { container } from "../DI/container";
import { GarageService } from "../services/garage/implementation/garageServices";
import { TYPES } from "../DI/types";
import HttpStatus from "../constants/httpStatusCodes";
import { PlanService } from "../services/plan/implimentation/planService";

export const hasActivePlan = async (req: Request, res: Response, next: NextFunction) => {
  const garageService = container.get<GarageService>(TYPES.GarageService);
  const planService = container.get<PlanService>(TYPES.PlanService);
  const garageId = req.user?.id;

  const { isActive, plan } = await garageService.getCurrentPlan(garageId!);

  if (!isActive || !plan) {
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      message: "You need an active plan to access this feature.",
    });
  }

  const currentPlan = await planService.getPlanById(plan.planId.toString())

  req.plan = currentPlan

  next();
};
