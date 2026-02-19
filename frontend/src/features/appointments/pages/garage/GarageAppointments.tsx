import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminTable, { type TableColumn } from "@/components/common/AdminTable";
import AdminHeader from "@/components/common/AdminHeader";
import _ from "lodash";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import AppointmentDetailsModal from "@/features/appointments/modals/AppointmentDetailsModal";
import { getActiveAppointmentsApi } from "../../services/appointmentServices";

const GarageAppointments = () => {
  const [appointments, setAppointments] = useState<PopulatedAppointmentData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [view, setView] = useState<"current" | "previous">("current");

  const servicesPerPage = 5;

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a._id === selectedAppointmentId) || null,
    [appointments, selectedAppointmentId],
  );

  const fetchAppointments = useCallback(
    async (currentPage: number, view: "current" | "previous") => {
      try {
        setLoading(true);
        const response = await getActiveAppointmentsApi(
          currentPage,
          servicesPerPage,
          view,
        );
        setAppointments(response.appointments);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      } finally {
        setLoading(false);
      }
    },
    [servicesPerPage],
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: "current" | "previous") => {
        fetchAppointments(page, query);
      }, 300),
    [fetchAppointments],
  );

  useEffect(() => {
    if (!view) {
      fetchAppointments(currentPage, "current");
    } else {
      debouncedFetch(currentPage, view);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, view, fetchAppointments, debouncedFetch]);

  const columns: TableColumn<PopulatedAppointmentData>[] = [
    { key: "appId", label: "ID" },
    { key: "vehicle.make.name", label: "Brand" },
    { key: "vehicle.model.name", label: "Model" },
    { key: "vehicle.licensePlate", label: "Number" },
    { key: "mechanicId.name", label: "Mechanic" },
    { key: "status", label: "Status" },
    {
      key: "appointmentDate",
      label: "Date",
      render: (item) =>
        new Date(item.appointmentDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Appointments"} />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          {/* switch to current and prev */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView("current")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                view === "current"
                  ? "bg-red-700 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              Current
            </button>

            <button
              onClick={() => setView("previous")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                view === "previous"
                  ? "bg-red-700 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              Previous
            </button>
          </div>

          {/* Table with glass effect */}
          <AdminTable
            data={appointments}
            columns={columns}
            emptyMessage={
              view === "current"
                ? "No active appointments found!"
                : "No previous appointments found!"
            }
            renderActions={(m) => {
              return (
                <div className="flex gap-3">
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => setSelectedAppointmentId(m._id)}
                  >
                    View
                  </button>
                </div>
              );
            }}
          />

          <Spinner loading={loading} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {selectedAppointmentId && selectedAppointment && (
            <AppointmentDetailsModal
              appointment={selectedAppointment}
              isOpen={!!selectedAppointmentId}
              onClose={() => setSelectedAppointmentId(null)}
              role="GARAGE_OWNER"
              onUpdate={() => fetchAppointments(currentPage, view)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageAppointments;
