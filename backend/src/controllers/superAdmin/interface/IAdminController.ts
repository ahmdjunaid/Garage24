import { NextFunction, Request, Response } from "express";

export default interface IAdminController {
    getAllGarages(req:Request, res:Response, next: NextFunction): Promise<void>;
    getAllUsers(req:Request, res:Response, next: NextFunction): Promise<void>;
    toggleStatus(req:Request, res:Response, next: NextFunction): Promise<void>;
    garageApproval(req:Request, res:Response, next: NextFunction): Promise<void>;
}