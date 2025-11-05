import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "../../components/elements/AdminTable";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import AdminHeader from "../../components/elements/AdminHeader";
import _ from "lodash";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import type { ActionPayload } from "../../types/CommonTypes";
import AddPlans from "../../components/modal/AddPlans";
import type { IPlan } from "../../types/PlanTypes";
import { fetchAllPlansApi } from "../../services/admin";

const AdminPlans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const plansPerPage = 5;

  const { token } = useSelector((state: RootState) => state.auth);

  const fetchPlans = useCallback(
    async (currentPage: number, searchQuery: string, token: string | null) => {
      try {
        const response = await fetchAllPlansApi(
          currentPage,
          plansPerPage,
          searchQuery,
          token
        );
        setPlans(response.plans);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      }
    },
    [plansPerPage]
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string, token: string | null) => {
        fetchPlans(page, query, token);
      }, 300),
    [fetchPlans]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchPlans(currentPage, "", token);
    } else {
      debouncedFetch(currentPage, searchQuery, token);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, token, searchQuery, fetchPlans, debouncedFetch]);

  const handleConfirm = async () => {
    // if (!action) return;

    // const { id, action: act } = action;

    // try {
    //   if (act === "delete") {
    //     await deleteMechanic(id, token);
    //     setMechanics((prev) => prev.filter((m) => m.userId !== id));
    //     successToast("Deleted successfully");
    //   } else if (act === "block" || act === "unblock") {
    //     await toggleUserStatusApi(id, act, token);
    //     setMechanics((prev) =>
    //       prev.map((m) =>
    //         m.userId === id ? { ...m, isBlocked: act === "block" } : m
    //       )
    //     );
    //     successToast(`${act}ed successfully`);
    //   }

    //   setAction(null);
    // } catch (error) {
    //   if (error instanceof Error) errorToast(error.message);
    //   console.error(error);
    // }
  };

  const columns: TableColumn<IPlan>[] = [
    { key: "name", label: "Name" },
    { key: "validity", label: "Validity" },
    { key: "price", label: "Price" },
    { key: "noOfMechanics", label: "No. of Mechanics" },
    { key: "noOfServices", label: "No. of Services" },
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
      <AdminSidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          text={"Plans"}
          searchPlaceholder={"Search Plans..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          <div className="flex justify-end mb-6">
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70 hover:scale-105"
              onClick={() => setShowModal(!showModal)}
            >
              Add Plans
            </button>
          </div>
          {/* create plan */}
          <AddPlans
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            token={token}
            onCreated={() => {
              setShowModal(false);
            }}
          />

          {/* Table with glass effect */}
          <AdminTable
            data={plans}
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

export default AdminPlans;
