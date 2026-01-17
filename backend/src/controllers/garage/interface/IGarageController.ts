import { NextFunction, Request, Response } from "express";

export default interface IGarageController {
    onboarding(req:Request, res:Response, next: NextFunction): Promise<void>;
    getApprovalStatus(req:Request, res:Response, next: NextFunction): Promise<void>;
    getCurrentPlan(req:Request, res:Response, next: NextFunction): Promise<void>;
    getGarageById(req:Request, res:Response, next: NextFunction): Promise<void>;
    getGarageDetailsById(req:Request, res:Response, next: NextFunction): Promise<void>;
    findNearbyGarages(req:Request, res:Response, next: NextFunction): Promise<void>;
}