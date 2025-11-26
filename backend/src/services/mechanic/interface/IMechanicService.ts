import { HydratedDocument } from "mongoose";
import { GetMappedMechanicResponse, IMechanic } from "../../../types/mechanic";
import { GetPaginationQuery } from "../../../types/common";

export default interface IMechanicService {
  onboarding(
    name: string,
    userId: string,
    skills: string[],
    image: Express.Multer.File,
    mobileNumber: string,
    password: string,
    newPassword: string
  ): Promise<{ message: string; mechanic: HydratedDocument<IMechanic> }>;
  registerMechanic(
    name: string,
    email: string,
    role: string,
    garageId: string,
    allowedMechanics:number
  ): Promise<{ message: string }>;
  getAllMechanics(
    query: GetPaginationQuery
  ): Promise<GetMappedMechanicResponse>;
  toggleStatus(userId: string, action: string): Promise<{ message: string }>;
  deleteUser(userId: string): Promise<{ message: string }>;
  resendMechanicInvite(mechanicId: string): Promise<{ message: string }>
}
