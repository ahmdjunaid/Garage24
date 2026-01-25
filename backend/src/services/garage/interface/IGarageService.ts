import { GarageDocument } from "../../../models/garage";
import { MechanicDocument } from "../../../models/mechanic";
import { SubscriptionDocument } from "../../../models/subscription";
import { GetPaginationQuery } from "../../../types/common";
import {
  GarageNearbyDto,
  GarageStatusResponse,
  GetMappedGarageResponse,
  IAddress,
  IGarage,
} from "../../../types/garage";

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
    isRSAEnabled: boolean,
    numOfServiceBays: number,
    supportedFuelTypes: string[]
  ): Promise<IGarage | null>;
  getApprovalStatus(userId: string): Promise<GarageStatusResponse>;
  getCurrentPlan(
    garageId: string
  ): Promise<{ isActive: boolean; plan: SubscriptionDocument | null, pendingSubs: SubscriptionDocument[]}>;
  getGarageById(garageId: string): Promise<IGarage | null>;
  getGarageDetails(garageId: string): Promise<{
    garage: GarageDocument | null;
    subscription: SubscriptionDocument | null;
    mechanics: MechanicDocument[] | null;
  }>;
  findNearbyGarages(lat: number, lng: number): Promise<GarageNearbyDto[]>;
  getAllGarages(query: GetPaginationQuery): Promise<GetMappedGarageResponse>;
  garageApproval(userId:string, action:string, reason:string): Promise<{ message: string }>;
}
