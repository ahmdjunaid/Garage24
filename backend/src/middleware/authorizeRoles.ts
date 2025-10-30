import { NextFunction, Request, Response } from "express";
import HttpStatus from "../constants/httpStatusCodes";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Access restricted to this route." });
    }

    next();
  };
};