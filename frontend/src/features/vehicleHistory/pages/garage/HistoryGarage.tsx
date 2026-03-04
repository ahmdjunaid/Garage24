import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminTable, { type TableColumn } from "@/components/common/AdminTable";
import AdminHeader from "@/components/common/AdminHeader";
import _ from "lodash";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import { fetchAptsByVehicleNumForGarageApi } from "../../services/historyServices";
import AppointmentHistoryModal from "../../modals/AppointmentHistoryModal";

const HistoryGarage = () => {
  const [appointments, setAppointments] = useState<PopulatedAppointmentData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [noResults, setNoResults] = useState<boolean>(false);

  const appointmentPerPage = 5;

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a._id === selectedAppointmentId) || null,
    [appointments, selectedAppointmentId],
  );

  const fetchAppointments = useCallback(
    async (page: number, licensePlate: string) => {
      try {
        setLoading(true);
        setNoResults(false);
        const response = await fetchAptsByVehicleNumForGarageApi(page, appointmentPerPage, licensePlate);
        setAppointments(response.appointments);
        setTotalPages(response.totalPages);
        setNoResults(response.appointments.length === 0 && !!licensePlate);
      } catch (error) {
        console.error("Error fetching vehicle history:", error);
      } finally {
        setLoading(false);
      }
    },
    [appointmentPerPage],
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchAppointments(page, query);
      }, 300),
    [fetchAppointments],
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchAppointments(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }
    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchAppointments, debouncedFetch]);

  const columns: TableColumn<PopulatedAppointmentData>[] = [
    { key: "appId", label: "ID" },
    { key: "vehicle.make.name", label: "Brand" },
    { key: "vehicle.model.name", label: "Model" },
    { key: "vehicle.licensePlate", label: "Reg. Number" },
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
        {/* Header WITHOUT search */}
        <AdminHeader text={"Service Records"} />

        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">

          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative max-w-md mx-auto">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by Registration Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.trim().toUpperCase())}
                className="w-full bg-gray-800 border border-gray-700 focus:border-red-500 focus:outline-none text-white placeholder-gray-500 text-sm rounded-lg pl-9 pr-4 py-2.5 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {noResults && searchQuery && !loading && (
              <p className="text-yellow-400 text-xs mt-2">
                No service records found for{" "}
                <span className="font-semibold">{searchQuery}</span>.
              </p>
            )}
          </div>

          <AdminTable
            data={appointments}
            columns={columns}
            emptyMessage={
              searchQuery
                ? `No history found for "${searchQuery}"`
                : "Enter a vehicle registration number to view its full service history."
            }
            renderActions={(m) => (
              <div className="flex gap-3">
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setSelectedAppointmentId(m._id)}
                >
                  View
                </button>
              </div>
            )}
          />

          <Spinner loading={loading} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {selectedAppointmentId && selectedAppointment && (
            <AppointmentHistoryModal
              appointment={selectedAppointment}
              isOpen={!!selectedAppointmentId}
              onClose={() => setSelectedAppointmentId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryGarage;