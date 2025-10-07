import bcrypt from "bcrypt";
import { resendOtpEmail, sendOtpEmail } from "../utils/sendOtp";
import IAuthService from "../interface/services/user/IAuthService";
import HttpStatus from "../constants/httpStatusCodes";
import { IAuthRepository } from "../interface/repositories/IUserRepositories";
import {  Role } from "../types/user";
import {
  EMAIL_NOT_VERIFIED,
  INVALID_CREDENTIALS,
  INVALID_OTP,
  OTP_EXPIRED,
  OTP_RESENT_SUCCESSFULLY,
  OTP_SENT_SUCCESSFULLY,
  OTP_VERIFIED_SUCCESSFULLY,
  PASSWORD_RESET_SUCCESSFULLY,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
} from "../constants/messages";
import { generateOtp } from "../utils/generateOtp";
import { generateCustomId } from "../utils/generateUniqueIds";
import { generateRefreshToken, generateResetToken, generateToken } from "../utils/jwt";
import crypto from "crypto";
import axios from "axios";
import { GOOGLE_FETCH_USER } from "../constants/api";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export class AuthService implements IAuthService {
  constructor(private _authRepository: IAuthRepository) {}

  async register(name: string, email: string, password: string, role: Role) {
    const existUser = await this._authRepository.findByEmail(email);
    if (existUser && existUser.isVerified) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_ALREADY_EXISTS };
    }

    if (existUser && !existUser.isVerified) {
      const { otp, hashedOtp } = generateOtp();
      existUser.otp = hashedOtp;
      existUser.otpExpires = new Date(Date.now() + 2 * 60 * 1000);

      await existUser.save();

      await sendOtpEmail(existUser.email, otp);
      return { user: existUser };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { otp, hashedOtp } = generateOtp();
    const Id = generateCustomId(role);

    const otpExpires = new Date(Date.now() + 2 * 60 * 1000);
    const { user } = await this._authRepository.register({
      Id,
      name,
      email,
      role,
      hashedOtp,
      otpExpires,
      hashedPassword,
    });

    await sendOtpEmail(email, otp);
    return { user };
  }

  async login(email: string, password: string) {
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    if (!user.isVerified) {
      throw { status: HttpStatus.FORBIDDEN, message: EMAIL_NOT_VERIFIED };
    }

    if (!user.password) {
      throw new Error("User has no password set");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw { status: HttpStatus.UNAUTHORIZED, message: INVALID_CREDENTIALS };
    }

    const token = generateToken(user._id as string, user.role);
    const refreshToken = generateRefreshToken(user._id as string, user.role);

    return { user, token, refreshToken };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (!user.otpExpires || !(user.otpExpires instanceof Date)) {
      throw { status: HttpStatus.BAD_REQUEST, message: OTP_EXPIRED };
    }

    if (user.otp !== hashedOtp) {
      throw { status: HttpStatus.BAD_REQUEST, message: INVALID_OTP };
    }

    if (new Date() > new Date(user.otpExpires)) {
      throw { status: HttpStatus.FORBIDDEN, message: OTP_EXPIRED };
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    const token = generateResetToken(user._id as string);

    await user.save();

    return {
      token,
      message: OTP_VERIFIED_SUCCESSFULLY,
    };
  }

  async forgotPassword(email: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const { otp, hashedOtp } = generateOtp();

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();
    await sendOtpEmail(email, otp);

    return { status: HttpStatus.OK, message: OTP_SENT_SUCCESSFULLY };
  }

  async resendOtp(email: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const { otp, hashedOtp } = generateOtp();

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();
    await resendOtpEmail(email, otp);

    return { status: HttpStatus.OK, message: OTP_RESENT_SUCCESSFULLY };
  }

  async resetPassword(email: string, password: string) {
      const user = await this._authRepository.findByEmail(email)

      if(!user){
        throw {status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND}
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds)

      user.password = hashedPassword;
      await user.save()

      return {status: HttpStatus.OK, message: PASSWORD_RESET_SUCCESSFULLY}
  }

  async googleAuth(accessToken: string) {
    const response = await axios.get(GOOGLE_FETCH_USER, {
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
}
