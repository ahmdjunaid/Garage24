import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import IAuthController from "../interface/IAuthController";
import {
  ALL_FIELDS_REQUIRED,
  AUTHENTICATION_FAILED,
  INVALID_EMAIL,
  LOGGED_OUT_MESSAGE,
  NO_REFRESH_TOKEN_FOUND,
  PROFILE_FIELDS_EMPTY,
} from "../../../constants/messages";
import IAuthService from "../../../services/auth/interface/IAuthService";
import dotenv from "dotenv";
import { loginSchema, registerSchema } from "../../../utils/zodValidate";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";
import { emailRegex } from "../../../constants/commonRegex";
dotenv.config();

const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

@injectable()
export class Authcontroller implements IAuthController {
  constructor(@inject(TYPES.AuthService) private _authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new AppError(HttpStatus.NOT_FOUND, parsed.error.message);
      }

      const { name, email, password, role } = parsed.data;
      const { message } = await this._authService.register(
        name,
        email,
        password,
        role
      );

      res.status(HttpStatus.OK).json({ message });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new AppError(HttpStatus.NOT_FOUND, parsed.error.message);
      }

      const { email, password } = parsed.data;

      const { user, token, refreshToken } = await this._authService.login(
        email,
        password
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, context } = req.body;
      const { token, message, userId } = await this._authService.verifyOtp(
        email,
        otp,
        context
      );

      res.status(HttpStatus.OK).json({
        message: message,
        token,
        userId,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res.status(HttpStatus.OK).json({ message: LOGGED_OUT_MESSAGE });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email || !emailRegex.test(email)) {
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_EMAIL);
      }

      const { message } = await this._authService.forgotPassword(email);

      res.status(HttpStatus.OK).json(message);
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, context } = req.body;

      if (!email || !emailRegex.test(email)) {
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_EMAIL);
      }

      const { message } = await this._authService.resendOtp(email, context);

      res.status(HttpStatus.OK).json({
        success: true,
        message: message,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new AppError(HttpStatus.NOT_FOUND, parsed.error.message);
      }

      const { email, password } = parsed.data;

      const { message } = await this._authService.resetPassword(
        email,
        password
      );

      res.status(HttpStatus.OK).json({ message });
    } catch (error) {
      next(error);
    }
  };

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.body;
      const { user, token, refreshToken } =
        await this._authService.googleAuth(accessToken);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json({ user, token });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        throw new AppError(HttpStatus.UNAUTHORIZED, NO_REFRESH_TOKEN_FOUND);
      }

      const { newAccessToken } =
        await this._authService.refreshToken(refreshToken);

      res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  };

  getUserDataById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._authService.getUserDataById(userId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateProfileData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, mobileNumber } = req.body;
      const image = req.file as Express.Multer.File;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      if (!image && !name && !mobileNumber) {
        throw new AppError(HttpStatus.BAD_REQUEST, PROFILE_FIELDS_EMPTY);
      }

      const response = await this._authService.updateProfileData({
        userId,
        name,
        mobileNumber,
        image,
      });

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);
      }

      if (!currentPassword || !newPassword) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
