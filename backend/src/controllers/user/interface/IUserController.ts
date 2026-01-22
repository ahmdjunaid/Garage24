import { NextFunction, Request, Response } from "express";

export default interface IUserController {
    getAllUsers(req:Request, res:Response, next: NextFunction): Promise<void>;
    toggleStatus(req:Request, res:Response, next: NextFunction): Promise<void>;
}