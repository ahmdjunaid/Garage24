import { NextFunction, Request, Response } from "express";

export interface IChatController {
    getAppointmentsForChat(req:Request, res:Response, next:NextFunction): Promise<void>;
    getMessagesByAppointmentId(req:Request, res:Response, next:NextFunction): Promise<void>;
    getAppointmentForChatById(req:Request, res:Response, next:NextFunction): Promise<void>;
}