import { NextFunction, Request, Response } from "express";

export default interface ISubscriptionController {
    subscribePlan(req:Request, res:Response, next: NextFunction): Promise<void>;
}