import { GetPaginationQuery } from "../../../types/common";
import { GetMappedUsersResponse } from "../../../types/admin";
import { usersDataMapping } from "../../../utils/dto/usersDto";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  USER_STATUS_UPDATE_FAILED,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";
import IUserService from "../interface/IUserService";
import { IUserRepository } from "../../../repositories/user/interface/IUserRepository";
import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.GarageRepository) private _garageRepository: IGarageRepository
  ) {}

  async getAllUsers(
    query: GetPaginationQuery
  ): Promise<GetMappedUsersResponse> {
    const response = await this._userRepository.getAllUsers(query);
    const mappedResponse = {
      users: response.users.map((user) => usersDataMapping(user)),
      totalUsers: response.totalUsers,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async toggleStatus(
    userId: string,
    action: string
  ): Promise<{ message: string }> {
    const data = {
      isBlocked: action === "block" ? true : false,
    };
    const response = await this._userRepository.findByIdAndUpdate(
      userId,
      data
    );

    if(response?.role == "garage"){
      await this._garageRepository.findOneAndUpdate({userId}, data)
    }

    if (!response) {
      throw new AppError(HttpStatus.BAD_REQUEST, USER_STATUS_UPDATE_FAILED)
    }

    return { message: `${action}ed successfull` };
  }
}
