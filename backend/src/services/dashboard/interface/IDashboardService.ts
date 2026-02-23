import { DashboardData } from "../../../types/dashboard";

export interface IDashboardService {
    getAdminDashboardData(type: "week" | "month" | "year"): Promise<DashboardData>
}