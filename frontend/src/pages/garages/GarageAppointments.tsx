import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "@components/layouts/admin/AdminTable";
import {
  getActiveAppointmentsApi,
} from "@/services/garageServices";
import AdminHeader from "@components/layouts/admin/AdminHeader";
import _ from "lodash";
import Spinner from "@components/elements/Spinner";
import Pagination from "@components/layouts/admin/Pagination";
import type { IAppointment } from "@/types/AppointmentTypes";


const GarageAppointments = () => {
  const [appointments, setAppointments] = useState<IAppointment>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const servicesPerPage = 5;

  const fetchServices = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await getActiveAppointmentsApi(
          currentPage,
          servicesPerPage,
          searchQuery
        );
        setAppointments(response.appointments);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      }
    },
    [servicesPerPage]
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchServices(page, query);
      }, 300),
    [fetchServices]
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

  const columns: TableColumn<IAppointment>[] = [
    { key: "_id", label: "ID" },
    { key: "vehicle.make.name", label: "Brand" },
    { key: "vehicle.model.name", label: "Model" },
    { key: "vehicle.licencePlate", label: "Number" },
    { key: "appointmentDate", label: "Date" },
    // {
    //   key: "isBlocked",
    //   label: "Status",
    //   render: (m) => (
    //     <span
    //       className={`px-3 py-1 rounded-full text-xs font-medium ${
    //         m.isBlocked
    //           ? "bg-red-900 text-red-300"
    //           : "bg-green-900 text-green-300"
    //       }`}
    //     >
    //       {m.isBlocked ? "Inactive" : "Active"}
    //     </span>
    //   ),
    // },
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
            // renderActions={(m) => {
            //   return (
            //     <div className="flex gap-3">
            //           <button
            //             className="text-blue-400 hover:text-blue-300"
            //             onClick={() =>
            //               setAction({
            //                 id: m._id,
            //                 name: m.name,
            //                 action: m.isBlocked ? "unblock" : "block",
            //               })
            //             }
            //           >
            //             {m.isBlocked ? "Unblock" : "Block"}
            //           </button>

            //           <button
            //             className="text-red-400 hover:text-red-300"
            //             onClick={() =>
            //               setAction({
            //                 id: m._id,
            //                 name: m.name,
            //                 action: "delete",
            //               })
            //             }
            //           >
            //             Delete
            //           </button>
            //     </div>
            //   );
            // }}
          />

          {/* <ConfirmModal
            isOpen={!!action}
            message={`Are you sure want ${action?.action} ${action?.name} service?`}
            onClose={() => setAction(null)}
            onConfirm={() => handleConfirm()}
            onCancel={() => setAction(null)}
          /> */}

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

export default GarageAppointments;