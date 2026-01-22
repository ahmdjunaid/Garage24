import { NextFunction, Request, Response } from "express";

export default interface IStripeController {
    handleWebhook(req:Request, res:Response, next: NextFunction): Promise<void>;
    getCheckoutSession(req:Request, res:Response, next: NextFunction): Promise<void>;
}