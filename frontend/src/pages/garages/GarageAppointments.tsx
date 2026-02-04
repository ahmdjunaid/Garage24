import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "@components/layouts/admin/AdminTable";
import { getActiveAppointmentsApi } from "@/services/garageServices";
import AdminHeader from "@components/layouts/admin/AdminHeader";
import _ from "lodash";
import Spinner from "@components/elements/Spinner";
import Pagination from "@components/layouts/admin/Pagination";
import type {
  PopulatedAppointmentData,
} from "@/types/AppointmentTypes";
import AppointmentDetailsModal from "@/components/modal/user/AppointmentDetailsModal";

const GarageAppointments = () => {
  const [appointments, setAppointments] = useState<PopulatedAppointmentData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewAppointment, setViewAppointment] = useState<PopulatedAppointmentData | null>(null)
  const servicesPerPage = 5;

  const fetchServices = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        setLoading(true)
        const response = await getActiveAppointmentsApi(
          currentPage,
          servicesPerPage,
          searchQuery,
        );
        console.log(response.appointments, "appointments");
        setAppointments(response.appointments);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      } finally {
        setLoading(false)
      }
    },
    [servicesPerPage],
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchServices(page, query);
      }, 300),
    [fetchServices],
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchServices(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchServices, debouncedFetch]);

  const columns: TableColumn<PopulatedAppointmentData>[] = [
    { key: "appId", label: "ID" },
    { key: "vehicle.make.name", label: "Brand" },
    { key: "vehicle.model.name", label: "Model" },
    { key: "vehicle.licensePlate", label: "Number" },
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
        <AdminHeader
          text={"Appointments"}
          searchPlaceholder={"Search Appointments..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          {/* Table with glass effect */}
          <AdminTable
            data={appointments}
            columns={columns}
            renderActions={(m) => {
              return (
                <div className="flex gap-3">
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() =>
                      setViewAppointment(m)
                    }
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

          {viewAppointment && (
            <AppointmentDetailsModal
              appointment={viewAppointment}
              isOpen={!!viewAppointment}
              onClose={() => setViewAppointment(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageAppointments;
