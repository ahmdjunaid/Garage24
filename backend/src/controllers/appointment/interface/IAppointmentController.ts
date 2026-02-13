import { Request, Response, NextFunction } from "express";

export interface IAppointmentController {
    getAppointmentMetaData(req:Request, res:Response, next: NextFunction):Promise<void>;
    createAppointment(req:Request, res:Response, next: NextFunction):Promise<void>;
    getActiveAppointments(req:Request, res:Response, next: NextFunction):Promise<void>;
    getAppointmentDetails(req:Request, res:Response, next: NextFunction):Promise<void>;
    getAllAppointmentsByUserId(req:Request, res:Response, next: NextFunction):Promise<void>;
    cancelAppointment(req:Request, res:Response, next: NextFunction):Promise<void>;
    getAppointmentForReschedule(req:Request, res:Response, next: NextFunction):Promise<void>;
    rescheduleAppointment(req:Request, res:Response, next: NextFunction):Promise<void>;
    assignMechanic(req:Request, res:Response, next: NextFunction):Promise<void>;
    updateServiceStatus(req:Request, res:Response, next: NextFunction):Promise<void>;
    getAllAppointmentByMechId(req:Request, res:Response, next: NextFunction):Promise<void>;
    makeServicePayment(req:Request, res:Response, next: NextFunction): Promise<void>;
}