import { DashboardData, MostBookedGarage } from "../../../types/dashboard";

export interface IDashboardService {
    getAdminDashboardData(type: "week" | "month" | "year"): Promise<DashboardData>;
    getTopFiveGarages(): Promise<MostBookedGarage[]>
}