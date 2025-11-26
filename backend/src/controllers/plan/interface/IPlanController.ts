import { Request, Response } from "express";

export default interface IPlanController {
    createPlans(req:Request, res:Response): Promise<void>;
    getAllPlans(req:Request, res:Response): Promise<void>;
    toggleStatus(req:Request, res:Response): Promise<void>;
    deletePlan(req:Request, res:Response): Promise<void>;
    updatePlan(req:Request, res:Response): Promise<void>;
}