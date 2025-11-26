import { Request, Response } from "express";

export default interface IStripeController {
    createSubscribeSession(req:Request, res:Response): Promise<void>;
    handleWebhook(req:Request, res:Response): Promise<void>;
    getCheckoutSession(req:Request, res:Response): Promise<void>;
}