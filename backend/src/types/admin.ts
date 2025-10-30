export interface IUsersMappedData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isOnboardingRequired: boolean;
  imageUrl?: string;
  mobileNumber?: string;
}

export interface GetMappedUsersResponse{
  users: IUsersMappedData[],
  totalUsers: number,
  totalPages: number
}