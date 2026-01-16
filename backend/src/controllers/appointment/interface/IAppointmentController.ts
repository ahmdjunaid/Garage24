import { Request, Response } from "express";

export interface IAppointmentController {
    getAppointmentMetaData(req:Request, res:Response):Promise<void>;
    createAppointment(req:Request, res:Response):Promise<void>;
    getActiveAppointments(req:Request, res:Response):Promise<void>;
}