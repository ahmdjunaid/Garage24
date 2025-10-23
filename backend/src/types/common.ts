export interface GetPaginationQuery {
  id?: string;
  page: number;
  limit: number;
  searchQuery: string;
}