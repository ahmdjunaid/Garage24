export interface ReportSummary {
  completed: number;
  cancelled: number;
  revenue: number;
}

export interface AppointmentReport {
  appointmentId: string;
  customer: string;
  vehicle: string;
  plate: string;
  service: string;
  price: number;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
}

export interface AppointmentReportResponse {
  summary: ReportSummary;
  appointments: AppointmentReport[];
  totalPages: number;
}