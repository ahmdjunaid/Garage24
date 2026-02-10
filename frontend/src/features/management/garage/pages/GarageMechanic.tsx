import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "@/components/common/AdminTable";
import { errorToast, successToast } from "@/utils/notificationAudio";
import {
  deleteMechanic,
  fetchMechanicsApi,
  resendInvitation,
  toggleUserStatusApi,
} from "@/features/management/garage/services/garageServices";
import AdminHeader from "@/components/common/AdminHeader";
import _ from "lodash";
import type { IMechanic } from "@/types/MechanicTypes";
import RegisterMechanic from "@/features/management/garage/modals/RegisterMechanic";
import { ConfirmModal } from "@components/modal/ConfirmModal";
import type { ActionPayload } from "@/types/CommonTypes";
import profilePlaceholder from "@assets/icons/profile-placeholder.jpg";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";

const GarageMechanic = () => {
  const [mechanics, setMechanics] = useState<IMechanic[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const mechanicsPerPage = 5;

  const fetchMechanics = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchMechanicsApi(
          currentPage,
          mechanicsPerPage,
          searchQuery
        );
        setMechanics(response.mechanics);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      }
    },
    [mechanicsPerPage]
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchMechanics(page, query);
      }, 300),
    [fetchMechanics]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchMechanics(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchMechanics, debouncedFetch]);

  const handleConfirm = async () => {
    if (!action) return;

    const { id, action: act } = action;

    try {
      if (act === "delete") {
        await deleteMechanic(id);
        setMechanics((prev) => prev.filter((m) => m.userId !== id));
        successToast("Deleted successfully");
      } else if (act === "block" || act === "unblock") {
        await toggleUserStatusApi(id, act);
        setMechanics((prev) =>
          prev.map((m) =>
            m.userId === id ? { ...m, isBlocked: act === "block" } : m
          )
        );
        successToast(`${act}ed successfully`);
      } else if (act === "Resend Invite") {
        setLoading(true);
        await resendInvitation(action.id);
        successToast("Invitation mail resend successfully!");
      }

      setAction(null);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<IMechanic>[] = [
    { key: "mechanicId", label: "ID" },
    {
      key: "imageUrl",
      label: "Image",
      render: (m) => (
        <img
          src={m.imageUrl || profilePlaceholder}
          className="w-10 h-10 rounded-full ring-2 ring-gray-700"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "skills", label: "Skills", render: (m) => m.skills.join(", ") },
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
          text={"Mechanics"}
          searchPlaceholder={"Search Mechanic..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          <div className="flex justify-end mb-6">
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70 hover:scale-105"
              onClick={() => setShowModal(!showModal)}
            >
              Add Mechanics
            </button>
          </div>

          {/* Register Mechanic */}
          <RegisterMechanic
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              fetchMechanics(currentPage, searchQuery);
            }}
          />

          {/* Table with glass effect */}
          <AdminTable
            data={mechanics}
            columns={columns}
            renderActions={(m) => {
              return (
                <div className="flex gap-3">
                  {m.isOnboardingRequired ? (
                    <>
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() =>
                          setAction({
                            id: m.userId,
                            name: m.name,
                            action: "Resend Invite",
                          })
                        }
                      >
                        Resend Invite
                      </button>

                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() =>
                          setAction({
                            id: m.userId,
                            name: m.name,
                            action: "delete",
                          })
                        }
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() =>
                          setAction({
                            id: m.userId,
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
                            id: m.userId,
                            name: m.name,
                            action: "delete",
                          })
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              );
            }}
          />

          <ConfirmModal
            isOpen={!!action}
            message={`Are you sure want ${action?.action} ${action?.name}`}
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

export default GarageMechanic;
