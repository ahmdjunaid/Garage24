import { GarageStatusResponse, IAddress, IGarage } from "../../../types/garage";
import { ISubscription } from "../../../types/subscription";

export default interface IGarageService {
  onboarding(
    name: string,
    userId: string,
    location: { lat: number; lng: number },
    address: IAddress,
    startTime: string,
    endTime: string,
    selectedHolidays: string[],
    image: Express.Multer.File,
    document: Express.Multer.File,
    mobile: string,
    isRSAEnabled: boolean
  ): Promise<IGarage | null>;
  getAddressFromCoordinates (lat:string, lng:string):Promise<IAddress>;
  getApprovalStatus(userId: string):Promise<GarageStatusResponse>;
  getCurrentPlan(garageId:string): Promise<{isActive: boolean, plan: ISubscription | null}>;
  getGarageById(garageId:string): Promise<IGarage | null>
}