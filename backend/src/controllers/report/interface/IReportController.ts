import { NextFunction, Request, Response } from "express";

export interface IReportController {
    getAppointmentReport(req:Request, res:Response, next: NextFunction): Promise<void>;
    downloadExcel(req:Request, res:Response, next: NextFunction): Promise<void>;
    downloadPDF(req:Request, res:Response, next: NextFunction): Promise<void>;
}