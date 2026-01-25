import HttpStatus from "../../../constants/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandler";
import { IAddress } from "../../../types/garage";
import { ILocationService } from "../interface/ILocationService";
import axios from "axios";

export class LocationService implements ILocationService {
  constructor() {}

  async getAddressFromCoordinates(lat: string, lng: string): Promise<IAddress> {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
        headers: {
          "User-Agent": "Garage24-Backend/1.0 (contact: support@garage24.com)",
          "Accept-Language": "en",
        },
        timeout: 5000,
      }
    );

    const data = response.data;

    return {
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "",
      district: data.address?.state_district || "",
      state: data.address?.state || "",
      pincode: data.address?.postcode || "",
      displayName: data.display_name
    };
  }

  async getCoordinatesFromName(
    name: string
  ): Promise<{ lat: number; lng: number }> {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: name,
          format: "json",
        },
        headers: {
          "User-Agent": "Garage24-Backend/1.0 (contact: support@garage24.com)",
          "Accept-Language": "en",
        },
        timeout: 5000,
      }
    );
    const data = response.data;

    if (!Array.isArray(data) || data.length === 0) {
      throw new AppError(HttpStatus.NOT_FOUND, "Location not found")
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };
  }
}
