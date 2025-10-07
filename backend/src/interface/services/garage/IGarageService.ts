import { HydratedDocument } from "mongoose";
import { IGarage } from "../../../types/garage";

export default interface IGarageService {
  onboarding(
    garageId: string,
    location: { lat: number; lng: number },
    plan: string,
    startTime: string,
    endTime: string,
    selectedHolidays: string[],
    image: string,
    mobile: string,
    isRSAEnabled: boolean
  ): Promise<{ garageData: HydratedDocument<IGarage> }>;
}
