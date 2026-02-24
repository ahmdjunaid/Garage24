import { NextFunction, Request, Response } from "express";

export interface IDashboardController {
    adminDashboardData(req:Request, res:Response, next:NextFunction): Promise<void>;
    getTopFiveBookedGarages(req:Request, res:Response, next:NextFunction): Promise<void>;
    getGarageDashboardData(req:Request, res:Response, next:NextFunction): Promise<void>;
    getTopFiveBookedServices(req:Request, res:Response, next:NextFunction): Promise<void>;
}