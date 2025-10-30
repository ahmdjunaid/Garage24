import bcrypt from "bcrypt";
import { resendOtpEmail, sendOtpEmail } from "../../../utils/sendOtp";
import IAuthService from "../interface/IAuthService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IAuthRepository } from "../../../repositories/user/interface/IUserRepositories";
import { Role } from "../../../types/user";
import {
  ACCOUNT_IS_BLOCKED,
  INVALID_CREDENTIALS,
  INVALID_OTP,
  INVALID_TOKEN,
  NO_REFRESH_TOKEN_FOUND,
  OTP_EXPIRED,
  OTP_RESENT_SUCCESSFULLY,
  OTP_SENT_SUCCESSFULLY,
  OTP_VERIFIED_SUCCESSFULLY,
  PASSWORD_RESET_SUCCESSFULLY,
  SIGNUP_SESSION_EXPIRED,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
} from "../../../constants/messages";
import { generateOtp } from "../../../utils/generateOtp";
import { generateCustomId } from "../../../utils/generateUniqueIds";
import {
  generateRefreshToken,
  generateResetToken,
  generateToken,
  verifyRefreshToken,
} from "../../../middleware/jwt";
import crypto from "crypto";
import axios from "axios";
import redisClient from "../../../config/redisClient";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export class AuthService implements IAuthService {
  constructor(private _authRepository: IAuthRepository) {}

  async register(name: string, email: string, password: string, role: Role) {
    const existUser = await this._authRepository.findByEmail(email);
    if (existUser) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_ALREADY_EXISTS };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { otp, hashedOtp } = generateOtp();
    const Id = generateCustomId(role);

    const userData = {
      Id,
      name,
      email,
      role,
      hashedPassword,
    };

    const redisDataKey = `userData:${email}`;
    const redisOtpKey = `otp:${email}`;

    await redisClient.setEx(redisDataKey, 600, JSON.stringify(userData));
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await sendOtpEmail(email, otp);
    return { message: "OTP sent for email verification." };
  }

  async login(email: string, password: string) {
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    if (user.isBlocked) {
      throw { status: HttpStatus.FORBIDDEN, message: ACCOUNT_IS_BLOCKED };
    }

    if (!user.password) {
      throw new Error("User has no password set");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw { status: HttpStatus.FORBIDDEN, message: INVALID_CREDENTIALS };
    }

    const token = generateToken(user._id as string, user.role);
    const refreshToken = generateRefreshToken(user._id as string, user.role);

    return { user, token, refreshToken };
  }

  async verifyOtp(email: string, otp: string, context: "register" | "other") {
    const redisOtpKey = `otp:${email}`;
    const redisDataKey = `userData:${email}`;

    const storedOtp = await redisClient.get(redisOtpKey);
    if (!storedOtp)
      throw { status: HttpStatus.BAD_REQUEST, message: OTP_EXPIRED };

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (storedOtp !== hashedOtp)
      throw { status: HttpStatus.BAD_REQUEST, message: INVALID_OTP };

    const response = {
      message: OTP_VERIFIED_SUCCESSFULLY,
      token: "",
    };

    switch (context) {
      case "register": {
        const userData = await redisClient.get(redisDataKey);
        if (!userData)
          throw {
            status: HttpStatus.BAD_REQUEST,
            message: SIGNUP_SESSION_EXPIRED,
          };

          await this._authRepository.register(JSON.parse(userData));
        break;
      }
      case "other": {
        const user = await this._authRepository.findByEmail(email)
        
        if(!user) throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };

        const token = generateResetToken(user._id as string);
        response.token = token;
        break;
      }

      default:
        break;
    }

    await redisClient.del(redisOtpKey)
    await redisClient.del(redisDataKey)
    return response;
  }

  async forgotPassword(email: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const { otp, hashedOtp } = generateOtp();

    const redisOtpKey = `otp:${email}`;
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await sendOtpEmail(email, otp);

    return { status: HttpStatus.OK, message: OTP_SENT_SUCCESSFULLY };
  }

  async resendOtp(email: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const { otp, hashedOtp } = generateOtp();

    const redisOtpKey = `otp:${email}`;
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await resendOtpEmail(email, otp);

    return { status: HttpStatus.OK, message: OTP_RESENT_SUCCESSFULLY };
  }

  async resetPassword(email: string, password: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return { status: HttpStatus.OK, message: PASSWORD_RESET_SUCCESSFULLY };
  }

  async googleAuth(accessToken: string) {
    const response = await axios.get(process.env.GOOGLE_FETCH_USER!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub, name, email, picture } = response.data;

    let user = await this._authRepository.findByEmail(email);

    if (!user) {
      const Id = generateCustomId("user");
      const result = await this._authRepository.register({
        Id,
        name,
        email,
        role: "user",
        googleID: sub,
        imageUrl: picture,
      });

      user = result.user;
    }

    const token = generateToken(user?._id as string, user?.role);
    const refreshToken = generateRefreshToken(user?._id as string, user?.role);

    return { user, token, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new Error(NO_REFRESH_TOKEN_FOUND);

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw { status: HttpStatus.FORBIDDEN, message: INVALID_TOKEN };
    }

    const user = await this._authRepository.findById(decoded.id);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    if (user.isBlocked) {
      throw { status: HttpStatus.FORBIDDEN, message: ACCOUNT_IS_BLOCKED };
    }
    const newAccessToken = generateToken(decoded.id, decoded.role);

    return { newAccessToken };
  }
}
