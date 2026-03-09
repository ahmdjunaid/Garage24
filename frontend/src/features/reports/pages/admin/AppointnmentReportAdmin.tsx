import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminTable, { type TableColumn } from "@/components/common/AdminTable";
import AdminHeader from "@/components/common/AdminHeader";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import {
  downloadAppointmentReportExcelAdminApi,
  downloadAppointmentReportPDFAdminApi,
  getAppointmentReportAdminApi,
} from "../../services/reportServices";
import type { AppointmentReport, ReportSummary } from "../../types/reportTypes";

const AppointnmentReportAdmin = () => {
  const [appointments, setAppointments] = useState<AppointmentReport[]>([]);
  const [summery, setSummery] = useState<ReportSummary>({
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rowsPerPage = 5;

  const fetchReports = useCallback(
    async (page: number, start: string, end: string) => {
      try {
        setLoading(true);

        const response = await getAppointmentReportAdminApi(
          start,
          end,
          page,
          rowsPerPage,
        );

        setAppointments(response.appointments);
        setTotalPages(response.totalPages);
        setSummery(response.summary);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage],
  );

  useEffect(() => {
    if (!startDate || !endDate) return;

    fetchReports(currentPage, startDate, endDate);
  }, [currentPage, startDate, endDate, fetchReports]);

  const columns: TableColumn<AppointmentReport>[] = [
    { key: "appointmentId", label: "ID" },
    { key: "customer", label: "Name" },
    { key: "vehicle", label: "Vehicle" },
    { key: "plate", label: "Licence Plate" },
    {
      key: "date",
      label: "Date",
      render: (item) =>
        new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    { key: "status", label: "Status" },
    { key: "paymentStatus", label: "Payment Status" },
  ];

  const handleQuickFilter = (type: string) => {
    const today = new Date();
    let start = new Date();

    if (type === "today") {
      start = today;
    }

    if (type === "week") {
      start.setDate(today.getDate() - 7);
    }

    if (type === "month") {
      start.setDate(today.getDate() - 30);
    }

    setFilter(type);

    const startStr = start.toISOString().split("T")[0];
    const endStr = today.toISOString().split("T")[0];

    setStartDate(startStr);
    setEndDate(endStr);
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    if (!startDate || !endDate) return;

    setCurrentPage(1);
    fetchReports(1, startDate, endDate);
  };

  const handleDownloadPDF = async () => {
    const response = await downloadAppointmentReportPDFAdminApi(
      startDate,
      endDate,
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "appointment-report.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadExcel = async () => {
    const response = await downloadAppointmentReportExcelAdminApi(
      startDate,
      endDate,
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "appointment-report.xlsx");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Appointments"} />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          {/* switch to current and prev */}
          <div className="bg-gray-900 p-4 rounded-xl mb-4 border border-gray-800">
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Filters */}
              <button
                onClick={() => handleQuickFilter("today")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filter === "today"
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                Today
              </button>

              <button
                onClick={() => handleQuickFilter("week")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filter === "week"
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                Last 7 Days
              </button>

              <button
                onClick={() => handleQuickFilter("month")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filter === "month"
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                Last 30 Days
              </button>

              {/* Custom Date */}
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg text-sm border border-gray-700"
                />

                <span className="text-gray-400 text-sm">to</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg text-sm border border-gray-700"
                />

                <button
                  onClick={handleApplyFilter}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800"
                >
                  Apply
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800"
                >
                  Excel
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Appointments */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Total Appointments</p>
              <h2 className="text-2xl font-semibold mt-1">
                {appointments.length}
              </h2>
            </div>

            {/* Completed */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Completed</p>
              <h2 className="text-2xl font-semibold text-green-500 mt-1">
                {summery.completed}
              </h2>
            </div>

            {/* Cancelled */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Cancelled</p>
              <h2 className="text-2xl font-semibold text-red-500 mt-1">
                {summery.cancelled}
              </h2>
            </div>

            {/* Revenue */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Revenue</p>
              <h2 className="text-2xl font-semibold text-yellow-400 mt-1">
                ₹{summery.revenue.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Table with glass effect */}
          <AdminTable
            data={appointments}
            columns={columns}
            emptyMessage={"Report not available."}
          />

          <Spinner loading={loading} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointnmentReportAdmin;
