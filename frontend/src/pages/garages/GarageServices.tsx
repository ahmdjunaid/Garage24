import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "@components/layouts/admin/AdminTable";
import { errorToast, successToast } from "@/utils/notificationAudio";
import {
  deleteServiceApi,
  fetchAllServicesApi,
  toggleServiceStatusApi,
} from "@/services/garageServices";
import AdminHeader from "@components/layouts/admin/AdminHeader";
import _ from "lodash";
import { ConfirmModal } from "@components/modal/ConfirmModal";
import type { ActionPayload } from "@/types/CommonTypes";
import Spinner from "@components/elements/Spinner";
import Pagination from "@components/layouts/admin/Pagination";
import type { IServiceResponse } from "@/types/ServicesTypes";
import RegisterServices from "@/components/modal/RegisterServices";

const GarageServices = () => {
  const [services, setServices] = useState<IServiceResponse[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const servicesPerPage = 5;

  const fetchServices = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchAllServicesApi(
          currentPage,
          servicesPerPage,
          searchQuery
        );
        setServices(response.services);
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

  const handleConfirm = async () => {
    if (!action) return;

    const { id, action: act } = action;

    try {
      if (act === "delete") {
        await deleteServiceApi(id);
        setServices((prev) => prev.filter((m) => m._id !== id));
        successToast("Deleted successfully");
      } else if (act === "block" || act === "unblock") {
        await toggleServiceStatusApi(id, act);
        setServices((prev) =>
          prev.map((m) =>
            m._id === id ? { ...m, isBlocked: act === "block" } : m
          )
        );
        successToast(`${act}ed successfully`);
      }

      setAction(null);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<IServiceResponse>[] = [
    { key: "_id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "price", label: "Price in INR" },
    { key: "categoryName", label: "Category" },
    { key: "durationMinutes", label: "Duration (Min)" },
    {
      key: "isBlocked",
      label: "Status",
      render: (m) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            m.isBlocked
              ? "bg-red-900 text-red-300"
              : "bg-green-900 text-green-300"
          }`}
        >
          {m.isBlocked ? "Inactive" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          text={"Services"}
          searchPlaceholder={"Search Services..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          <div className="flex justify-end mb-6">
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70 hover:scale-105"
              onClick={() => setShowModal(!showModal)}
            >
              Add Services
            </button>
          </div>

          {/* Register Mechanic */}
          <RegisterServices
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              fetchServices(currentPage, searchQuery);
            }}
          />

          {/* Table with glass effect */}
          <AdminTable
            data={services}
            columns={columns}
            renderActions={(m) => {
              return (
                <div className="flex gap-3">
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() =>
                          setAction({
                            id: m._id,
                            name: m.name,
                            action: m.isBlocked ? "unblock" : "block",
                          })
                        }
                      >
                        {m.isBlocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() =>
                          setAction({
                            id: m._id,
                            name: m.name,
                            action: "delete",
                          })
                        }
                      >
                        Delete
                      </button>
                </div>
              );
            }}
          />

          <ConfirmModal
            isOpen={!!action}
            message={`Are you sure want ${action?.action} ${action?.name} service?`}
            onClose={() => setAction(null)}
            onConfirm={() => handleConfirm()}
            onCancel={() => setAction(null)}
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

export default GarageServices;