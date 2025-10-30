import { Request, Response, NextFunction } from "express";
import HttpStatus from "../constants/httpStatusCodes";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
