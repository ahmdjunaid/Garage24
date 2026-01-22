import { UserDocument } from "../../../models/user";
import { GetPaginationQuery } from "../../../types/common";
import { GetUserResponse, IUser } from "../../../types/user";

export interface IUserRepository {
  getAllUsers({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<GetUserResponse>;
  findByIdAndUpdate(
    userId: string,
    data: Partial<IUser>
  ): Promise<UserDocument | null>;
}
