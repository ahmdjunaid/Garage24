import { Request, Response } from "express";

export default interface IAdminController {
    getAllGarages(req:Request, res:Response): Promise<void>;
    getAllUsers(req:Request, res:Response): Promise<void>;
    toggleStatus(req:Request, res:Response): Promise<void>;
    garageApproval(req:Request, res:Response): Promise<void>;
}