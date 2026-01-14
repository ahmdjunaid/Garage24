import { Request, Response } from "express";

export default interface IVehicleController {
    createVehicle(req:Request, res:Response): Promise<void>;
    getAllVehicleByUserId(req:Request, res:Response): Promise<void>;
    getVehicleById(req:Request, res:Response): Promise<void>;
}