import { DashboardData, GarageDashboardData, MostBookedGarage, MostBookedServices } from "../../../types/dashboard";

export interface IDashboardService {
    getAdminDashboardData(type: "week" | "month" | "year"): Promise<DashboardData>;
    getTopFiveGarages(): Promise<MostBookedGarage[]>
    getGarageDashboardData(garageId: string, type: "week" | "month" | "year"): Promise<GarageDashboardData>;
    getTopFiveServices(garageId:string): Promise<MostBookedServices[]>;
}