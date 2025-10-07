import { Request, Response } from "express";
import HttpStatus from "../../constants/httpStatusCodes";
import IAuthController from "../../interface/controller/user/IAuthController";
import {
  ERROR_WHILE_FORGOT_PASS,
  ERROR_WHILE_RESEND_OTP,
  GOOGLE_AUTH_ERROR,
  INVALID_EMAIL,
  SERVER_ERROR,
} from "../../constants/messages";
import IAuthService from "../../interface/services/user/IAuthService";
import dotenv from "dotenv";
import { loginSchema, registerSchema } from "../../utils/zodValidate";
dotenv.config();

const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

export class Authcontroller implements IAuthController {
  constructor(private _authService: IAuthService) {}
  /**
   *
   * @param req
   * @param res
   */
  register = async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);

      if (!parsed.success) {
        throw { status: HttpStatus.NOT_FOUND, message: parsed.error.message };
      }

      const { name, email, password, role } = parsed.data;
      const { user } = await this._authService.register(
        name,
        email,
        password,
        role
      );

      res.status(HttpStatus.OK).json({ user });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        throw { status: HttpStatus.NOT_FOUND, message: parsed.error.message };
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
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const { token, message } = await this._authService.verifyOtp(email, otp);

      res.status(HttpStatus.OK).json({
        message: message,
        token,
      });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res.status(HttpStatus.OK).json({ message: "Logged out successfully." });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Logout failed", error: err });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!email || !emailRegex.test(email)) {
        throw { status: HttpStatus.BAD_REQUEST, message: INVALID_EMAIL };
      }

      const { message } = await this._authService.forgotPassword(email);

      res.status(HttpStatus.OK).json({ message: message });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_WHILE_FORGOT_PASS });
      console.log(error, "Error while forgot password");
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!email || !emailRegex.test(email)) {
        throw { status: HttpStatus.BAD_REQUEST, message: INVALID_EMAIL };
      }

      const { message } = await this._authService.resendOtp(email);

      res.status(HttpStatus.OK).json({
        success: true,
        message: message,
      });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || ERROR_WHILE_RESEND_OTP });
      console.error("Error while resend OTP.", err);
    }
  };

  resetPassword = async (req:Request, res:Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        throw { status: HttpStatus.NOT_FOUND, message: parsed.error.message };
      }

      const { email, password } = parsed.data;

      const { message } = await this._authService.resetPassword(email, password)

      res.status(HttpStatus.OK).json({message})
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || ERROR_WHILE_RESEND_OTP });
      console.error("Error while reset password.", err);
    }
  }

  googleAuth = async (req: Request, res: Response) => {
    try {
      const { accessToken } = req.body;
      const { user, token, refreshToken } = await this._authService.googleAuth(accessToken)

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json({user, token})
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || GOOGLE_AUTH_ERROR });
      console.error("Error while google authentication.", err);
    }
  };
}
