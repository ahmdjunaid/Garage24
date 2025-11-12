import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/layouts/AdminSidebar";
import AdminHeader from "../../components/layouts/AdminHeader";
import {
  fetchAllGaragesApi,
  toggleStatusApi,
} from "../../services/admin";
import profilePlaceholder from "../../assets/icons/profile-placeholder.jpg";
import _ from "lodash";
import type {
  IMappedGarageData,
} from "../../types/GarageTypes";
import { errorToast, successToast } from "../../utils/notificationAudio";
import AdminTable, {
  type TableColumn,
} from "../../components/layouts/AdminTable";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import type { ActionPayload } from "../../types/CommonTypes";
import GarageDetailsSection from "../../components/modal/GarageDetailsSection";

const AdminGarages = () => {
  const [garages, setGarages] = useState<IMappedGarageData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const garagesPerPage = 5;

  const fetchGarages = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchAllGaragesApi(
          currentPage,
          garagesPerPage,
          searchQuery
        );
        setGarages(
          response.garages.filter(
            (garage: IMappedGarageData) => garage.approvalStatus !== "rejected"
          )
        );
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      }
    },
    [garagesPerPage]
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchGarages(page, query);
      }, 300),
    [fetchGarages]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchGarages(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchGarages, debouncedFetch]);

  const handleConfirm = async () => {
    if (!action) return;
    try {
      await toggleStatusApi(action.id, action.action);
      setGarages((prev) =>
        prev.map((m) =>
          m._id === action.id
            ? { ...m, isBlocked: action.action === "block" }
            : m
        )
      );
      successToast(`${action.action}ed successfull`);
      setAction(null);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
      console.error(error);
    }
  };

  const columns: TableColumn<IMappedGarageData>[] = [
    { key: "userId", label: "ID" },
    {
      key: "imageUrl",
      label: "Image",
      render: (g) => (
        <img
          src={g.imageUrl || profilePlaceholder}
          className="w-10 h-10 rounded-full ring-2 ring-gray-700"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "plan", label: "Plan" },
    {
      key: "isBlocked",
      label: "Status",
      render: (g) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            g.isBlocked || !g?.plan?.name
              ? "bg-red-900 text-red-300"
              : "bg-green-900 text-green-300"
          }`}
        >
          {g.isBlocked || !g?.plan?.name ? "Inactive" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          text={"Garages"}
          searchPlaceholder={"Search garages..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          {/* Table with glass effect */}
          {preview === null ? (
            <AdminTable
              data={garages}
              columns={columns}
              renderActions={(m) => {
                return (
                  <div className="flex gap-3">
                    {m.approvalStatus === "approved" ? (
                      <>
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
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => setPreview(m._id)}
                        >
                          View
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => setPreview(m._id)}
                      >
                        View
                      </button>
                    )}
                  </div>
                );
              }}
            />
          ) : (
            <GarageDetailsSection
              garageId={preview}
              onBack={() => {
                setPreview(null)
                fetchGarages(currentPage, searchQuery);
              }}
            />
          )}

          <ConfirmModal
            isOpen={!!action}
            message={`Are you sure want ${action?.action} ${action?.name}`}
            onClose={() => setAction(null)}
            onConfirm={() => handleConfirm()}
            onCancel={() => setAction(null)}
          />

          {/* Pagination */}
          <div className="px-6 py-5 flex items-center justify-center gap-4">
            <button
              className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30"
              onClick={() => setCurrentPage((c) => (c > 1 ? c - 1 : c))}
            >
              ‹
            </button>
            <span className="text-sm text-gray-400">
              Page{" "}
              <span className="text-red-400 font-semibold">{currentPage}</span>{" "}
              of <span className="text-gray-300">{totalPages}</span>
            </span>
            <button
              className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30"
              onClick={() =>
                setCurrentPage((c) => (c < totalPages ? c + 1 : c))
              }
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGarages;
