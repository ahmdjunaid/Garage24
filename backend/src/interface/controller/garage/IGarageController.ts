import { Request, Response } from "express";

export default interface IGarageController {
    onboarding(req:Request, res:Response): Promise<void>;
}