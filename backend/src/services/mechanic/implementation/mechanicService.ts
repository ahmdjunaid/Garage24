import { IAuthRepository } from "../../../repositories/user/interface/IUserRepositories";
import IMechanicService from "../interface/IMechanicService";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import HttpStatus from "../../../constants/httpStatusCodes";
import { USER_NOT_FOUND } from "../../../constants/messages";
import bcrypt from "bcrypt";
import { uploadFile } from "../../../config/s3Service";
import { deleteLocalFile } from "../../../helper/helper";

export class MechanicService implements IMechanicService {
  constructor(
    private _mechanicRepository: IMechanicRepository,
    private _authRepository: IAuthRepository
  ) {}

  async onboarding(
    name: string,
    userId: string,
    skills: string[],
    image: Express.Multer.File,
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

    const imageUrl = await uploadFile(image,"profile")
    if (image?.path) deleteLocalFile(image.path);

    const data = {
      name,
      skills,
      imageUrl,
      mobileNumber,
    };    

    const mechanicData = await this._mechanicRepository.findOneAndUpdate(
      userId,
      data
    );
    if (!mechanicData) throw {status: HttpStatus.NOT_FOUND, message: "Mechanic not found"};

    await this._authRepository.findOneAndUpdate(userId, {
      isOnboardingRequired: false,
      password: hashedPassword
    });

    return { message: "Updated successfully", mechanic: mechanicData };
  }
}
