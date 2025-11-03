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