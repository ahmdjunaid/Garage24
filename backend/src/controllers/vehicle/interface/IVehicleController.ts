import { NextFunction, Request, Response } from "express";

export default interface IVehicleController {
    createVehicle(req:Request, res:Response, next: NextFunction): Promise<void>;
    getAllVehicleByUserId(req:Request, res:Response, next: NextFunction): Promise<void>;
    getVehicleById(req:Request, res:Response, next: NextFunction): Promise<void>;
    deleteVehicleById(req:Request, res:Response, next: NextFunction): Promise<void>;
    updateVehicleData(req:Request, res:Response, next: NextFunction): Promise<void>;
}