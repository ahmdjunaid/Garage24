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