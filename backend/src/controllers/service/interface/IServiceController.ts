import { Request, Response } from "express";

export default interface IServiceController {
    createService(req:Request, res:Response): Promise<void>;
    getAllServices(req:Request, res:Response): Promise<void>;
    toggleStatus(req:Request, res:Response): Promise<void>;
    deleteService(req:Request, res:Response): Promise<void>;
    getServicesByGarageId(req:Request, res:Response): Promise<void>;
}