import { NextFunction, Request, Response } from "express";

export default interface IPlanController {
    createPlans(req:Request, res:Response, next: NextFunction): Promise<void>;
    getAllPlans(req:Request, res:Response, next: NextFunction): Promise<void>;
    toggleStatus(req:Request, res:Response, next: NextFunction): Promise<void>;
    deletePlan(req:Request, res:Response, next: NextFunction): Promise<void>;
    updatePlan(req:Request, res:Response, next: NextFunction): Promise<void>;
}