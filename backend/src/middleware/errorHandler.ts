import { Request, Response, NextFunction } from "express";
import HttpStatus from "../constants/httpStatusCodes";

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  void _next;
  console.error(err);

  const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    message,
  });
};
