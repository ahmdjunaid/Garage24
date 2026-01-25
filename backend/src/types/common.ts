export interface GetPaginationQuery {
  id?: string;
  page: number;
  limit: number;
  searchQuery: string;
}

export interface ProfileDataUpdate {
  userId: string;
  name?: string; 
  image?: Express.Multer.File, 
  mobileNumber?: string
}