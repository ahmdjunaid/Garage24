import { Request, Response, NextFunction } from "express";
import { IReportController } from "../interface/IReportController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IReportService } from "../../../services/report/interface/IReportService";
import { AppError } from "../../../middleware/errorHandler";
import { AUTHENTICATION_FAILED } from "../../../constants/messages";
import HttpStatus from "../../../constants/httpStatusCodes";
import XLSX from "xlsx";
import puppeteer from "puppeteer";

@injectable()
export class ReportController implements IReportController {
  constructor(
    @inject(TYPES.ReportService) private _reportService: IReportService
  ) {}

  getAppointmentReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      let garageId: string | undefined;

      if (!userId)
        throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);

      if (!startDate || !endDate || !page || !limit) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Period should be selected to generate report."
        );
      }

      if (req.user?.role === "garage") {
        garageId = userId;
      }

      const response = await this._reportService.getAppointmentReport(
        startDate as string,
        endDate as string,
        garageId,
        page,
        limit
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  downloadExcel = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const userId = req.user?.id;
    let garageId: string | undefined;

    if (!userId)
      throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);

    if (req.user?.role === "garage") {
      garageId = userId;
    }

    const report = await this._reportService.getAppointmentReport(
      startDate as string,
      endDate as string,
      garageId
    );

    const worksheet = XLSX.utils.json_to_sheet(report.appointments);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=appointment-report.xlsx"
    );

    res.send(buffer);
  };

  downloadPDF = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const userId = req.user?.id;
    let garageId: string | undefined;

    if (!userId)
      throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);

    if (req.user?.role === "garage") {
      garageId = userId;
    }

    const report = await this._reportService.getAppointmentReport(
      startDate as string,
      endDate as string,
      garageId
    );

    const html = `
    <h1>Appointment Report</h1>
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Vehicle</th>
          <th>Service</th>
          <th>Status</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${report.appointments
          .map(
            (a) => `
          <tr>
            <td>${a.appointmentId}</td>
            <td>${a.customer}</td>
            <td>${a.vehicle}</td>
            <td>${a.service}</td>
            <td>${a.status}</td>
            <td>${a.price}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
    });

    await browser.close();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=appointment-report.pdf"
    );

    res.send(pdf);
  };
}
