export interface IMechanic {
  userId: string;
  mechanicId: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isOnboardingRequired: boolean;
  role: string;
  skills: string[];
  imageUrl?: string;
  mobileNumber?: string;
}

export interface IBaseMechanic {
  name: string;
  garageId: string;
  userId: string;
  skills: string[];
  imageUrl: string;
  mobileNumber: string;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface AssignableMechanic {
  _id: string;
  name: string;
  userId: string;
  skills: string[]
}