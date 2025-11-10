import { Request, Response } from "express";

export default interface IGarageController {
    onboarding(req:Request, res:Response): Promise<void>;
    getAddressFromCoordinates (req:Request, res:Response): Promise<void>;
    registerMechanic(req:Request, res:Response): Promise<void>;
    getAllMechanics(req:Request, res:Response): Promise<void>;
    toggleStatus(req:Request, res:Response): Promise<void>;
    deleteMechanic(req:Request, res:Response): Promise<void>;
    getApprovalStatus(req:Request, res:Response): Promise<void>;
}