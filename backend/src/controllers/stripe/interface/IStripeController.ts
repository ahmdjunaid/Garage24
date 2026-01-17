import { NextFunction, Request, Response } from "express";

export default interface IStripeController {
    createSubscribeSession(req:Request, res:Response, next: NextFunction): Promise<void>;
    handleWebhook(req:Request, res:Response, next: NextFunction): Promise<void>;
    getCheckoutSession(req:Request, res:Response, next: NextFunction): Promise<void>;
}