import { IAddress } from "../../../types/garage";

export interface ILocationService {
  getAddressFromCoordinates(lat: string, lng: string): Promise<IAddress>;
  getCoordinatesFromName(name: string): Promise<{ lat: number; lng: number }>;
}
