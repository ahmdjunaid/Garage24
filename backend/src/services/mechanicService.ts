import cloudinary from "../config/cloudinary";
import { IAuthRepository } from "../interface/repositories/IUserRepositories";
import IMechanicService from "../interface/services/mechanic/IMechanicService";
import { IMechanicRepository } from "../interface/repositories/IMechanicRepository";
import HttpStatus from "../constants/httpStatusCodes";
import { USER_NOT_FOUND } from "../constants/messages";
import bcrypt from "bcrypt";

export class MechanicService implements IMechanicService {
  constructor(
    private _mechanicRepository: IMechanicRepository,
    private _authRepository: IAuthRepository
  ) {}
  async register(garageId: string, userId: string) {
    const { message } = await this._mechanicRepository.register({
      garageId,
      userId,
    });
    return { message: message };
  }

  async onboarding(
    userId: string,
    skills: string[],
    image: string,
    mobileNumber: string,
    password: string,
    newPassword: string
  ) {
    const user = await this._authRepository.findById(userId);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    if (!password || !user.password) {
      throw { status: HttpStatus.BAD_REQUEST, message: "Password missing" };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "One-time password is incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "garage24/profileImages",
    });

    const data = {
      skills,
      image: uploadRes.secure_url,
      mobileNumber,
    };

    const mechanicData = await this._mechanicRepository.findOneAndUpdate(
      userId,
      data
    );
    if (!mechanicData) throw {status: HttpStatus.NOT_FOUND, message: "Mechanic not found"};

    await this._authRepository.findByIdAndUpdate(userId, {
      isOnboardingRequired: false,
      password: hashedPassword
    });

    return { message: "Updated successfully", mechanic: mechanicData };
  }
}
