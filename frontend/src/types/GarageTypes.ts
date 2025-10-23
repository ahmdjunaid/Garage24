export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IAddress {
  city: { type: string };
  district: { type: string }
  state: { type: string };
  pincode: { type: string };
}


export interface IMappedGarageData {
  _id: string;
  garageId: string;
  name: string;
  email: string;
  role:string;
  isBlocked:boolean;
  location?: ILocation;
  address?: IAddress;
  plan?: string;
  startTime?: string;
  endTime?: string;
  selectedHolidays?: string[];
  imageUrl?: string;
  mobileNumber?: string;
  isRSAEnabled?: boolean;
}