import { inject, injectable } from "inversify";
import { IDashboardService } from "../interface/IDashboardService";
import { TYPES } from "../../../DI/types";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { getDateRanges } from "../../../utils/getDateRanges";
import { formatChart } from "../../../utils/fomatChart";
import {
  DashboardData,
  GarageDashboardData,
  MostBookedGarage,
  MostBookedServices,
} from "../../../types/dashboard";
import { Types } from "mongoose";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { INVALID_INPUT } from "../../../constants/messages";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository,
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.MechanicRepository)
    private _mechanicRepository: IMechanicRepository
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

    // -------- Service Revenue --------
    const serviceGrowth =
      previousAppointmentRevenue === 0
        ? currentAppointmentRevenue === 0
          ? 0
          : 100
        : ((currentAppointmentRevenue - previousAppointmentRevenue) /
            previousAppointmentRevenue) *
          100;

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

      services: currentAppointmentRevenue,
      servChange: serviceGrowth.toFixed(1) + "%",
      servUp: serviceGrowth >= 0,

      totalSubs: currentSubRevenue,
      subGrowth: subsRevenueGrowth.toFixed(1) + "%",

      bookingChart: appointmentChartData.data,
      labels: appointmentChartData.labels,

      subChart: subscriptionChartData.data,
      subLabels: subscriptionChartData.labels,
    };
  }

  async getTopFiveGarages(): Promise<MostBookedGarage[]> {
    const LIMIT = 5;
    return await this._appointmentRepository.getMostBookedGaragesIds(LIMIT);
  }

  async getGarageDashboardData(
    garageId: string,
    type: "week" | "month" | "year"
  ): Promise<GarageDashboardData> {
    const { current, previous } = getDateRanges(type);

    const [currentAppointments, previousAppointments] = await Promise.all([
      this._appointmentRepository.aggregateDashboardData(
        current.start,
        current.end,
        type,
        { garageUID: new Types.ObjectId(garageId) }
      ),
      this._appointmentRepository.aggregateDashboardData(
        previous.start,
        previous.end,
        type,
        { garageUID: new Types.ObjectId(garageId) }
      ),
    ]);

    const [currentAppointmentCount, prevAppointmentCount] = await Promise.all([
      this._appointmentRepository.aggregateAppointmentOnStatus(
        current.start,
        current.end,
        { garageUID: new Types.ObjectId(garageId) }
      ),
      this._appointmentRepository.aggregateAppointmentOnStatus(
        previous.start,
        previous.end,
        { garageUID: new Types.ObjectId(garageId) }
      ),
    ]);

    // -------- Revenue --------
    const currentAppointmentRevenue =
      currentAppointments.revenue[0]?.total || 0;
    const previousAppointmentRevenue =
      previousAppointments.revenue[0]?.total || 0;

    const revenueGrowth =
      previousAppointmentRevenue === 0
        ? 100
        : ((currentAppointmentRevenue - previousAppointmentRevenue) /
            previousAppointmentRevenue) *
          100;

    // --------Total Appointment Count --------
    const currentTotalAppointment = currentAppointmentCount.totalAppointments;
    const previousTotalAppointment = prevAppointmentCount.totalAppointments;

    const appointmentGrowth =
      previousTotalAppointment === 0
        ? currentTotalAppointment === 0
          ? 0
          : 100
        : ((currentTotalAppointment - previousTotalAppointment) /
            previousTotalAppointment) *
          100;

    // -------- Completed Appointment Count --------
    const currentCompletedAppointment =
      currentAppointmentCount.completedAppointments;
    const previousCompletedAppointment =
      prevAppointmentCount.completedAppointments;

    const completionGrowth =
      previousCompletedAppointment === 0
        ? currentCompletedAppointment === 0
          ? 0
          : 100
        : ((currentCompletedAppointment - previousCompletedAppointment) /
            previousCompletedAppointment) *
          100;

    // -------- Charts --------
    const appointmentChartData = formatChart(type, currentAppointments.chart);

    return {
      revenue: currentAppointmentRevenue,
      revChange: revenueGrowth.toFixed(1) + "%",
      revUp: revenueGrowth >= 0,

      appointments: currentTotalAppointment,
      appointmentChange: appointmentGrowth.toFixed(1) + "%",
      appointmentUp: appointmentGrowth >= 0,

      completed: currentCompletedAppointment,
      completedChange: completionGrowth.toFixed(1) + "%",
      completedUp: completionGrowth >= 0,

      bookingChart: appointmentChartData.data,
      labels: appointmentChartData.labels,
    };
  }

  async getTopFiveServices(garageId: string): Promise<MostBookedServices[]> {
    const LIMIT = 5;
    return await this._appointmentRepository.getMostBookedServices(
      garageId,
      LIMIT
    );
  }

  async getMechanicDashboardData(
    mechanicId: string,
    type: "week" | "month" | "year"
  ): Promise<GarageDashboardData> {

    const mechanic = await this._mechanicRepository.findOneByUserId(mechanicId);
    if (!mechanic) throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT);

    const { current, previous } = getDateRanges(type);

    const [currentAppointments, previousAppointments] = await Promise.all([
      this._appointmentRepository.aggregateDashboardData(
        current.start,
        current.end,
        type,
        { mechanicId: new Types.ObjectId(mechanic._id) }
      ),
      this._appointmentRepository.aggregateDashboardData(
        previous.start,
        previous.end,
        type,
        { mechanicId: new Types.ObjectId(mechanic._id) }
      ),
    ]);

    console.log(currentAppointments, previousAppointments)

    const [currentAppointmentCount, prevAppointmentCount] = await Promise.all([
      this._appointmentRepository.aggregateAppointmentOnStatus(
        current.start,
        current.end,
        { mechanicId: new Types.ObjectId(mechanic._id) }
      ),
      this._appointmentRepository.aggregateAppointmentOnStatus(
        previous.start,
        previous.end,
        { mechanicId: new Types.ObjectId(mechanic._id) }
      ),
    ]);

    // -------- Revenue --------
    const currentAppointmentRevenue =
      currentAppointments.revenue[0]?.total || 0;
    const previousAppointmentRevenue =
      previousAppointments.revenue[0]?.total || 0;

    const revenueGrowth =
      previousAppointmentRevenue === 0
        ? 100
        : ((currentAppointmentRevenue - previousAppointmentRevenue) /
            previousAppointmentRevenue) *
          100;

    // --------Total Appointment Count --------
    const currentTotalAppointment = currentAppointmentCount.totalAppointments;
    const previousTotalAppointment = prevAppointmentCount.totalAppointments;

    const appointmentGrowth =
      previousTotalAppointment === 0
        ? currentTotalAppointment === 0
          ? 0
          : 100
        : ((currentTotalAppointment - previousTotalAppointment) /
            previousTotalAppointment) *
          100;

    // -------- Completed Appointment Count --------
    const currentCompletedAppointment =
      currentAppointmentCount.completedAppointments;
    const previousCompletedAppointment =
      prevAppointmentCount.completedAppointments;

    const completionGrowth =
      previousCompletedAppointment === 0
        ? currentCompletedAppointment === 0
          ? 0
          : 100
        : ((currentCompletedAppointment - previousCompletedAppointment) /
            previousCompletedAppointment) *
          100;

    // -------- Charts --------
    const appointmentChartData = formatChart(type, currentAppointments.chart);

    return {
      revenue: currentAppointmentRevenue,
      revChange: revenueGrowth.toFixed(1) + "%",
      revUp: revenueGrowth >= 0,

      appointments: currentTotalAppointment,
      appointmentChange: appointmentGrowth.toFixed(1) + "%",
      appointmentUp: appointmentGrowth >= 0,

      completed: currentCompletedAppointment,
      completedChange: completionGrowth.toFixed(1) + "%",
      completedUp: completionGrowth >= 0,

      bookingChart: appointmentChartData.data,
      labels: appointmentChartData.labels,
    };
  }
}
