export type Role = "user" | "admin" | "garage" | "mechanic";
export interface RouteRoles {
  user: string;
  mechanic: string;
  garage: string;
  admin: string;
}


export interface ILocation {
  lat: number;
  lng: number;
}

export interface IUsersMappedData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  isOnboardingRequired: boolean;
  imageUrl?: string;
  mobileNumber?: string;
}