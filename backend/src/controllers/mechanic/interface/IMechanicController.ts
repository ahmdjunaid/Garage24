import { NextFunction, Request, Response } from "express";

export default interface IMechanicController {
    onboarding(req:Request, res:Response, next: NextFunction): Promise<void>;
    registerMechanic(req:Request, res:Response, next: NextFunction): Promise<void>;
    getAllMechanics(req:Request, res:Response, next: NextFunction): Promise<void>;
    toggleStatus(req:Request, res:Response, next: NextFunction): Promise<void>;
    deleteMechanic(req:Request, res:Response, next: NextFunction): Promise<void>;
    resendMechanicInvite(req:Request, res:Response, next: NextFunction): Promise<void>;
}