import { Request, Response } from "express";

export default interface IMechanicController {
    register(req:Request, res:Response): Promise<void>;
    onboarding(req:Request, res:Response): Promise<void>;
}