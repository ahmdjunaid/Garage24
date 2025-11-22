import { Request, Response } from "express";

export default interface IGarageController {
    onboarding(req:Request, res:Response): Promise<void>;
    getAddressFromCoordinates (req:Request, res:Response): Promise<void>;
    getApprovalStatus(req:Request, res:Response): Promise<void>;
    getAllPlans(req:Request, res:Response): Promise<void>;
}