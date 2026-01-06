import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "@components/layouts/admin/AdminTable";
import AdminHeader from "@components/layouts/admin/AdminHeader";
import _ from "lodash";
import { ConfirmModal } from "@components/modal/ConfirmModal";
import type { ActionPayload } from "@/types/CommonTypes";
import AddPlans from "@components/modal/AddPlans";
import type { IPlan } from "@/types/PlanTypes";
import {
  deletePlansApi,
  fetchAllPlansApi,
  togglePlanStatusApi,
} from "@/services/adminServices";
import Pagination from "@components/layouts/admin/Pagination";
import { errorToast, successToast } from "@/utils/notificationAudio";
import EditPlans from "@components/modal/EditPlans";

const AdminPlans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const [editData, setEditData] = useState<IPlan | null>(null);
  const plansPerPage = 5;

  const fetchPlans = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchAllPlansApi(
          currentPage,
          plansPerPage,
          searchQuery
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
      _.debounce((page: number, query: string) => {
        fetchPlans(page, query);
      }, 300),
    [fetchPlans]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchPlans(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchPlans, debouncedFetch]);

  const handleConfirm = async () => {
    if (!action) return;

    const { id, action: act } = action;

    try {
      if (act === "delete") {
        await deletePlansApi(id);
        setPlans((prev) => prev.filter((p) => p._id !== id));
        successToast("Deleted successfully");
      } else if (act === "block" || act === "unblock") {
        await togglePlanStatusApi(id, act);
        setPlans((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isBlocked: act === "block" } : p
          )
        );
        successToast(`${act}ed successfully`);
      }

      setAction(null);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
      console.error(error);
    }
  };

  const columns: TableColumn<IPlan>[] = [
    { key: "name", label: "Name" },
    { key: "validity", label: "Validity (Days)" },
    { key: "price", label: "Price in INR" },
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
            onCreated={() => {
              setShowModal(false);
              fetchPlans(currentPage, searchQuery);
            }}
          />

          {editData && (
            <EditPlans
              onClose={() => setEditData(null)}
              onEdited={() => {
                setEditData(null);
                fetchPlans(currentPage, searchQuery);
              }}
              planData={editData}
            />
          )}

          {/* Table with glass effect */}
          <AdminTable
            data={plans}
            columns={columns}
            renderActions={(m) => {
              return (
                <div className="flex gap-3">
                  <button
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => setEditData(m)}
                  >
                    Edit
                  </button>

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

export default AdminPlans;
