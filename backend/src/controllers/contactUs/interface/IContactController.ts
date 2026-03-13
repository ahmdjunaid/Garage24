import { NextFunction, Request, Response } from "express";

export interface IContactController {
    sendContactFormEmail(req:Request, res:Response, next:NextFunction): Promise<void>;
}