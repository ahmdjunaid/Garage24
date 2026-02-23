export interface DashboardData {
    revenue: number;
    revChange: string;
    revUp: boolean;
    subscriptions: number;
    subChange: string;
    subUp: boolean;
    totalSubs: number;
    subGrowth: string;
    bookingChart: number[];
    labels: string[];
    subChart: number[];
    subLabels: string[];
}

export interface DashboardAggregationResult {
  revenue: { total: number }[];
  chart: { _id: number; count: number }[];
  totalCount: { count: number }[];
}