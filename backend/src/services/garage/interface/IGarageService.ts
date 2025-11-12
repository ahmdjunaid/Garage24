import { GarageStatusResponse, IAddress, IGarage } from "../../../types/garage";
import { GetMappedMechanicResponse} from "../../../types/mechanic";
import { GetPaginationQuery } from "../../../types/common";
import { GetMappedPlanResponse, ICheckoutSession } from "../../../types/plan";

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
  ): Promise<{ garageData: IGarage }>;
  getAddressFromCoordinates (lat:string, lng:string):Promise<IAddress>;
  registerMechanic( garageId:string, userId:string):Promise<{ message: string }>;
  getAllMechanics(query: GetPaginationQuery):Promise<GetMappedMechanicResponse>;
  toggleStatus(userId:string,action: string):Promise<{message:string}>;
  deleteUser(userId: string):Promise<{message:string}>;
  getApprovalStatus(userId: string):Promise<GarageStatusResponse>;
  getAllPlans(query: GetPaginationQuery):Promise<GetMappedPlanResponse>;
  createCheckoutSession(data: ICheckoutSession):Promise<{ url: string }>
}