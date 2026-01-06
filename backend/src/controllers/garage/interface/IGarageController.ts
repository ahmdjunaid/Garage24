import { Request, Response } from "express";

export default interface IGarageController {
    onboarding(req:Request, res:Response): Promise<void>;
    getAddressFromCoordinates (req:Request, res:Response): Promise<void>;
    getApprovalStatus(req:Request, res:Response): Promise<void>;
    getCurrentPlan(req:Request, res:Response): Promise<void>;
    getGarageById(req:Request, res:Response): Promise<void>;
}