import { IAuthRepository } from "../../../repositories/auth/interface/IAuthRepositories";
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
import { AssignableMechanic, GetMappedMechanicResponse } from "../../../types/mechanic";
import { mechanicDataMapping } from "../../../utils/dto/mechanicDto";
import { generateCustomId } from "../../../utils/generateUniqueIds";
import { generatePassword } from "../../../utils/generatePassword";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";
import { IEmailService } from "../../email/interface/IEmailService";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class MechanicService implements IMechanicService {
  constructor(
    @inject(TYPES.MechanicRepository)
    private _mechanicRepository: IMechanicRepository,
    @inject(TYPES.AuthRepository) private _authRepository: IAuthRepository,
    @inject(TYPES.EmailService) private __emailService: IEmailService
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
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }

    if (!password || !user.password) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Password missing");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "One-time password is incorrect"
      );
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
      throw new AppError(HttpStatus.NOT_FOUND, "Mechanic not found");

    await this._authRepository.findOneAndUpdate(userId, {
      isOnboardingRequired: false,
      password: hashedPassword,
      imageUrl: imageUrl,
    });

    return { mechanic: mechanicData };
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
      throw new AppError(HttpStatus.BAD_REQUEST, EMAIL_ALREADY_EXIST);
    }

    const noOfMechanics =
      await this._mechanicRepository.countDocuments(garageId);
    if (noOfMechanics >= allowedMechanics) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        `Mechanic limit reached. Your plan allows only ${allowedMechanics} mechanics.`
      );
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
    await this.__emailService.sendMechanicInvitation(email, password, user.name);
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
    const mechResponse = await this._mechanicRepository.findOneAndUpdate(
      userId,
      data
    );

    if (!response || !mechResponse) {
      throw new AppError(HttpStatus.BAD_REQUEST, USER_STATUS_UPDATE_FAILED);
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
      throw new AppError(HttpStatus.BAD_REQUEST, USER_STATUS_UPDATE_FAILED);
    }

    return { message: "Deleted successfull" };
  }

  async resendMechanicInvite(mechanicId: string): Promise<{ message: string }> {
    const mechanic = await this._authRepository.findById(mechanicId);
    if (!mechanic) {
      throw new AppError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this._authRepository.findByIdAndUpdate(mechanicId, {
      password: hashedPassword,
    });

    await this.__emailService.sendMechanicInvitation(mechanic.email, password, mechanic.name);

    return { message: "Invitation resend successfull" };
  }

  async getAssignableMechanics(garageId: string): Promise<AssignableMechanic[]> {
    return await this._mechanicRepository.getAssignableMechanics(garageId)
  }
}
