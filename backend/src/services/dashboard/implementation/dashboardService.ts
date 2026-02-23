import { inject, injectable } from "inversify";
import { IDashboardService } from "../interface/IDashboardService";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { getDateRanges } from "../../../utils/getDateRanges";
import { formatChart } from "../../../utils/fomatChart";
import { DashboardData } from "../../../types/dashboard";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository,
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository
  ) {}

  async getAdminDashboardData(
    type: "week" | "month" | "year"
  ): Promise<DashboardData> {
    const { current, previous } = getDateRanges(type);

    const [currentAppointments, previousAppointments] = await Promise.all([
      this._appointmentRepository.aggregateDashboardData(
        current.start,
        current.end,
        type
      ),
      this._appointmentRepository.aggregateDashboardData(
        previous.start,
        previous.end,
        type
      ),
    ]);

    const [currentSubs, previousSubs] = await Promise.all([
      this._subscriptionRepository.aggregateDashboardData(
        current.start,
        current.end,
        type
      ),
      this._subscriptionRepository.aggregateDashboardData(
        previous.start,
        previous.end,
        type
      ),
    ]);

    // -------- Revenue --------
    const currentAppointmentRevenue =
      currentAppointments.revenue[0]?.total || 0;
    const previousAppointmentRevenue =
      previousAppointments.revenue[0]?.total || 0;

    const currentSubRevenue = currentSubs.revenue[0]?.total || 0;
    const previousSubRevenue = previousSubs.revenue[0]?.total || 0;

    const totalCurrentRevenue = currentAppointmentRevenue + currentSubRevenue;
    const totalPrevRevenue = previousAppointmentRevenue + previousSubRevenue;

    const revenueGrowth =
      totalPrevRevenue === 0
        ? 100
        : ((totalCurrentRevenue - totalPrevRevenue) / totalPrevRevenue) * 100;

    const subsRevenueGrowth =
      previousSubRevenue === 0
        ? 100
        : ((currentSubRevenue - previousSubRevenue) / previousSubRevenue) * 100;

    // -------- Subscription Count --------
    const currentSubCount = currentSubs.totalCount[0]?.count || 0;
    const previousSubCount = previousSubs.totalCount[0]?.count || 0;

    const subscriptionGrowth =
      previousSubCount === 0
        ? currentSubCount === 0
          ? 0
          : 100
        : ((currentSubCount - previousSubCount) / previousSubCount) * 100;

    // -------- Charts --------
    const appointmentChartData = formatChart(type, currentAppointments.chart);
    const subscriptionChartData = formatChart(type, currentSubs.chart);

    return {
      revenue: totalCurrentRevenue,
      revChange: revenueGrowth.toFixed(1) + "%",
      revUp: revenueGrowth >= 0,

      subscriptions: currentSubCount,
      subChange: subscriptionGrowth.toFixed(1) + "%",
      subUp: subscriptionGrowth >= 0,

      totalSubs: currentSubRevenue,
      subGrowth: subsRevenueGrowth.toFixed(1) + "%",

      bookingChart: appointmentChartData.data,
      labels: appointmentChartData.labels,

      subChart: subscriptionChartData.data,
      subLabels: subscriptionChartData.labels,
    };
  }
}
