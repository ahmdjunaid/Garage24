import { NextFunction, Request, Response } from "express";

export default interface IAuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  forgotPassword(req:Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req:Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req:Request, res:Response, next: NextFunction): Promise<void>;
  googleAuth(req:Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req:Request, res: Response, next: NextFunction): Promise<void>;
}
