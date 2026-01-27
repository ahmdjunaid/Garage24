import bcrypt from "bcrypt";
import IAuthService from "../interface/IAuthService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IAuthRepository } from "../../../repositories/auth/interface/IAuthRepositories";
import { IUser, Role } from "../../../types/user";
import {
  ACCOUNT_IS_BLOCKED,
  INVALID_CREDENTIALS,
  INVALID_OTP,
  INVALID_TOKEN,
  NEW_PASSWORD_CANNOT_BE_SAME,
  NO_REFRESH_TOKEN_FOUND,
  OTP_EXPIRED,
  OTP_RESENT_SUCCESSFULLY,
  OTP_SENT_SUCCESSFULLY,
  OTP_VERIFIED_SUCCESSFULLY,
  PASSWORD_CHANGED_SUCCESS,
  PASSWORD_NOT_SET,
  PASSWORD_RESET_SUCCESSFULLY,
  REGISTRATION_ALREADY_INITATED,
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
import { injectable, inject } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";
import { IEmailService } from "../../email/interface/IEmailService";
import { UserDocument } from "../../../models/user";
import { ProfileDataUpdate } from "../../../types/common";
import { deleteFromS3, uploadFile } from "../../../config/s3Service";
import { deleteLocalFile } from "../../../helper/helper";
import { extractS3KeyFromUrl } from "../../../utils/extractS3KeyFromUrl";
import { usersDataMapping } from "../../../utils/dto/usersDto";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.AuthRepository) private _authRepository: IAuthRepository,
    @inject(TYPES.EmailService) private _emailService: IEmailService
  ) {}

  async register(name: string, email: string, password: string, role: Role) {
    const existUser = await this._authRepository.findByEmail(email);
    if (existUser)
      throw new AppError(HttpStatus.NOT_FOUND, USER_ALREADY_EXISTS);

    const redisDataKey = `userData:${email}`;
    const redisOtpKey = `otp:${email}`;

    const initiatedProcess = await redisClient.get(redisDataKey);

    if (initiatedProcess)
      throw new AppError(HttpStatus.CONFLICT, REGISTRATION_ALREADY_INITATED);

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

    await redisClient.setEx(redisDataKey, 600, JSON.stringify(userData));
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await this._emailService.sendOtpEmail(email, otp);
    return { message: OTP_SENT_SUCCESSFULLY };
  }

  async login(email: string, password: string) {
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new AppError(HttpStatus.FORBIDDEN, ACCOUNT_IS_BLOCKED);
    }

    if (!user.password) {
      throw new AppError(HttpStatus.BAD_REQUEST, PASSWORD_NOT_SET);
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError(HttpStatus.FORBIDDEN, INVALID_CREDENTIALS);
    }

    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    const mappedUser = usersDataMapping(user);

    return { user: mappedUser, token, refreshToken };
  }

  async verifyOtp(email: string, otp: string, context: "register" | "other") {
    const redisOtpKey = `otp:${email}`;
    const redisDataKey = `userData:${email}`;

    const storedOtp = await redisClient.get(redisOtpKey);
    if (!storedOtp) throw new AppError(HttpStatus.BAD_REQUEST, OTP_EXPIRED);

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (storedOtp !== hashedOtp)
      throw new AppError(HttpStatus.BAD_REQUEST, INVALID_OTP);

    const response = {
      message: OTP_VERIFIED_SUCCESSFULLY,
      token: "",
      userId: "",
    };

    switch (context) {
      case "register": {
        const userData = await redisClient.get(redisDataKey);
        if (!userData)
          throw new AppError(HttpStatus.BAD_REQUEST, SIGNUP_SESSION_EXPIRED);

        const { user } = await this._authRepository.register(
          JSON.parse(userData)
        );
        response.userId = user._id.toString();
        break;
      }
      case "other": {
        const user = await this._authRepository.findByEmail(email);

        if (!user) throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);

        const token = generateResetToken(user._id.toString());
        response.token = token;
        break;
      }

      default:
        break;
    }

    await redisClient.del(redisOtpKey);
    await redisClient.del(redisDataKey);
    return response;
  }

  async forgotPassword(email: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }

    const { otp, hashedOtp } = generateOtp();

    const redisOtpKey = `otp:${email}`;
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await this._emailService.sendOtpEmail(email, otp);

    return new AppError(HttpStatus.OK, OTP_SENT_SUCCESSFULLY);
  }

  async resendOtp(email: string, context: "register" | "other") {
    const redisDataKey = `userData:${email}`;

    const userExist =
      context === "register"
        ? await redisClient.get(redisDataKey)
        : await this._authRepository.findByEmail(email);

    if (!userExist) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }

    const { otp, hashedOtp } = generateOtp();

    const redisOtpKey = `otp:${email}`;
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await this._emailService.resendOtpEmail(email, otp);

    return { status: HttpStatus.OK, message: OTP_RESENT_SUCCESSFULLY };
  }

  async resetPassword(email: string, password: string) {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
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

    const token = generateToken(user?._id.toString(), user?.role);
    const refreshToken = generateRefreshToken(user?._id.toString(), user?.role);

    return { user, token, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw new AppError(HttpStatus.BAD_REQUEST, NO_REFRESH_TOKEN_FOUND);

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new AppError(HttpStatus.FORBIDDEN, INVALID_TOKEN);
    }

    const user = await this._authRepository.findById(decoded.id);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new AppError(HttpStatus.FORBIDDEN, ACCOUNT_IS_BLOCKED);
    }
    const newAccessToken = generateToken(decoded.id, decoded.role);

    return { newAccessToken };
  }

  async getUserDataById(userId: string): Promise<UserDocument | null> {
    return await this._authRepository.findById(userId);
  }

  async updateProfileData(data: ProfileDataUpdate): Promise<IUser | null> {
    const user = await this._authRepository.findById(data.userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }
    const update: Partial<IUser> = {};

    if (user.name !== data.name) {
      update.name = data.name;
    }

    if (user.mobileNumber !== data.mobileNumber) {
      update.mobileNumber = data.mobileNumber;
    }

    if (data.image) {
      const imageUrl = await uploadFile(data.image, "profile");
      if (user.imageUrl) {
        const key = extractS3KeyFromUrl(user.imageUrl);

        if (key) {
          await deleteFromS3(key);
        }
      }
      if (data.image?.path) deleteLocalFile(data.image.path);
      update.imageUrl = imageUrl;
    }

    return await this._authRepository.findByIdAndUpdate(data.userId, update);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string> {
    const user = await this._authRepository.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.BAD_REQUEST, USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new AppError(HttpStatus.BAD_REQUEST, PASSWORD_NOT_SET);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new AppError(HttpStatus.BAD_REQUEST, INVALID_CREDENTIALS);
    }

    const isSamePrevPass = await bcrypt.compare(newPassword, user.password);

    if (isSamePrevPass) {
      throw new AppError(HttpStatus.BAD_REQUEST, NEW_PASSWORD_CANNOT_BE_SAME);
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.save();

    return PASSWORD_CHANGED_SUCCESS;
  }
}
