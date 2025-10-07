import { HydratedDocument } from "mongoose";
import { IMechanic } from "../../../types/mechanic";

export default interface IMechanicService {
  register(
    garageId: string,
    userId: string,
  ): Promise<{ message: string }>;

  onboarding(
    userId:string,
    skills: string[],
    image: string,
    mobileNumber: string,
    password: string,
    newPassword:string
  ): Promise<{message: string, mechanic:HydratedDocument<IMechanic>}>
}