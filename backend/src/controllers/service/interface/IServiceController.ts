import { NextFunction, Request, Response } from "express";

export default interface IServiceController {
    createService(req:Request, res:Response, next: NextFunction): Promise<void>;
    getAllServices(req:Request, res:Response, next: NextFunction): Promise<void>;
    toggleStatus(req:Request, res:Response, next: NextFunction): Promise<void>;
    deleteService(req:Request, res:Response, next: NextFunction): Promise<void>;
    getServicesByGarageId(req:Request, res:Response, next: NextFunction): Promise<void>;
}