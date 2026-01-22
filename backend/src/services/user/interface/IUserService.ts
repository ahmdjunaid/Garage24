import { GetPaginationQuery } from "../../../types/common";
import { GetMappedUsersResponse } from "../../../types/admin";

export default interface IUserService {
  getAllUsers(query: GetPaginationQuery):Promise<GetMappedUsersResponse>;
  toggleStatus(userId:string,action: string): Promise<{message:string}>;
}