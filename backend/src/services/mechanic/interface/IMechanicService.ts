import { HydratedDocument } from "mongoose";
import { IMechanic } from "../../../types/mechanic";

export default interface IMechanicService {
  register(
    garageId: string,
    userId: string,
  ): Promise<{ message: string }>;

  onboarding(
    name: string,
    userId:string,
    skills: string[],
    image: Express.Multer.File,
    mobileNumber: string,
    password: string,
    newPassword:string
  ): Promise<{message: string, mechanic:HydratedDocument<IMechanic>}>
}