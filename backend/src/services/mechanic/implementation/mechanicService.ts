import { IAuthRepository } from "../../../repositories/user/interface/IUserRepositories";
import IMechanicService from "../interface/IMechanicService";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  EMAIL_ALREADY_EXIST,
  USER_NOT_FOUND,
  USER_STATUS_UPDATE_FAILED,
} from "../../../constants/messages";
import bcrypt from "bcrypt";
import { uploadFile } from "../../../config/s3Service";
import { deleteLocalFile } from "../../../helper/helper";
import { GetPaginationQuery } from "../../../types/common";
import { GetMappedMechanicResponse } from "../../../types/mechanic";
import { mechanicDataMapping } from "../../../utils/dto/mechanicDto";
import { generateCustomId } from "../../../utils/generateUniqueIds";
import { generatePassword } from "../../../utils/generatePassword";
import { sentMechanicInvitation } from "../../../utils/sendOtp";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class MechanicService implements IMechanicService {
  constructor(
    @inject(TYPES.MechanicRepository) private _mechanicRepository: IMechanicRepository,
    @inject(TYPES.AuthRepository) private _authRepository: IAuthRepository
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

    const imageUrl = await uploadFile(image, "profile");
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
    if (!mechanicData)
      throw { status: HttpStatus.NOT_FOUND, message: "Mechanic not found" };

    await this._authRepository.findOneAndUpdate(userId, {
      isOnboardingRequired: false,
      password: hashedPassword,
    });

    return { message: "Updated successfully", mechanic: mechanicData };
  }

  async registerMechanic(
    name: string,
    email: string,
    role: string,
    garageId: string,
    allowedMechanics: number
  ) {
    const userExists = await this._authRepository.findByEmail(email);
    if (userExists) {
      throw { status: HttpStatus.BAD_REQUEST, message: EMAIL_ALREADY_EXIST };
    }

    const noOfMechanics = await this._mechanicRepository.countDocuments(garageId)
    if(noOfMechanics >= allowedMechanics){
      throw {
        status:HttpStatus.BAD_REQUEST, 
        message: `Mechanic limit reached. Your plan allows only ${allowedMechanics} mechanics.`}
    }

    const customId = generateCustomId("mechanic");
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { user } = await this._authRepository.register({
      Id: customId,
      name,
      email,
      role,
      hashedPassword,
    });

    await this._mechanicRepository.register({
      userId: user._id.toString(),
      garageId,
      name: user.name,
    });
    await sentMechanicInvitation(email, password, user.name);
    return { message: "Mechanic created successfully" };
  }

  async getAllMechanics(
    query: GetPaginationQuery
  ): Promise<GetMappedMechanicResponse> {
    const response = await this._mechanicRepository.getAllMechanics(query);

    const mappedResponse = {
      mechanics: response.mechanics.map((mechanic) =>
        mechanicDataMapping(mechanic)
      ),
      totalMechanics: response.totalMechanics,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }
  
  async toggleStatus(userId: string, action: string) {
    const data = {
      isBlocked: action === "block" ? true : false,
    };
    const response = await this._authRepository.findByIdAndUpdate(userId, data);
    const mechResponse = await this._mechanicRepository.findOneAndUpdate(userId, data);

    if (!response || !mechResponse) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: USER_STATUS_UPDATE_FAILED,
      };
    }

    return { message: `${action}ed successfull` };
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    await this._mechanicRepository.findOneAndUpdate(userId, {
      isDeleted: true,
    });
    const response = await this._authRepository.findByIdAndUpdate(userId, {
      isDeleted: true,
    });

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: USER_STATUS_UPDATE_FAILED,
      };
    }

    return { message: "Deleted successfull" };
  }

  async resendMechanicInvite(mechanicId: string): Promise<{ message: string }> {
    const mechanic = await this._authRepository.findById(mechanicId);
    if (!mechanic) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this._authRepository.findByIdAndUpdate(mechanicId, {
      password: hashedPassword,
    });

    await sentMechanicInvitation(mechanic.email, password, mechanic.name);

    return { message: "Invitation resend successfull" };
  }
}
