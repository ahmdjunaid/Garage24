import { Request, Response } from "express";

export default interface IMechanicController {
    onboarding(req:Request, res:Response): Promise<void>;
}