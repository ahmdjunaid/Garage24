import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import AdminTable, {
  type TableColumn,
} from "../../components/elements/AdminTable";
import { errorToast, successToast } from "../../utils/notificationAudio";
import {
  deleteMechanic,
  fetchMechanicsApi,
  registerMechanicApi,
  toggleUserStatusApi,
} from "../../services/garage";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import AdminHeader from "../../components/elements/AdminHeader";
import _ from "lodash";
import type { IMechanic } from "../../types/MechanicTypes";
import RegisterMechanic, {
  type registerData,
} from "../../components/modal/RegisterMechanic";
import OtpModalDark from "../../components/modal/OtpModalDark";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import type { ActionPayload } from "../../types/CommonTypes";
import profilePlaceholder from "../../assets/icons/profile-placeholder.jpg";

const GarageMechanic = () => {
  const [mechanics, setMechanics] = useState<IMechanic[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [newUser, setNewUser] = useState<registerData | null>(null);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const mechanicsPerPage = 5;

  const { user, token } = useSelector((state: RootState) => state.auth);
  const garageId = user?._id;

  const handleMechanicRegister = async (userId: string) => {
    try {
      await registerMechanicApi({ garageId, userId }, token);
      successToast("Mechanic account created successfully.");
      fetchMechanics(currentPage, searchQuery, token);
    } catch (error) {
      if (error instanceof Error)
        errorToast(error.message || "Error while creating new mechanic");
    }
  };

  const fetchMechanics = useCallback(
    async (currentPage: number, searchQuery: string, token: string | null) => {
      try {
        console.log(searchQuery)
        const response = await fetchMechanicsApi(
          currentPage,
          mechanicsPerPage,
          searchQuery,
          token
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
      _.debounce((page: number, query: string, token: string | null) => {
        fetchMechanics(page, query, token);
      }, 300),
    [fetchMechanics]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchMechanics(currentPage, "", token);
    } else {
      debouncedFetch(currentPage, searchQuery, token);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, token, searchQuery, fetchMechanics, debouncedFetch]);

  const handleConfirm = async () => {
    if (!action) return;

    const { id, action: act } = action;

    try {
      if (act === "delete") {
        await deleteMechanic(id, token);
        setMechanics((prev) => prev.filter((m) => m.userId !== id));
        successToast("Deleted successfully");
      } else if (act === "block" || act === "unblock") {
        await toggleUserStatusApi(id, act, token);
        setMechanics((prev) =>
          prev.map((m) =>
            m.userId === id ? { ...m, isBlocked: act === "block" } : m
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
            onCreated={(data) => {
              setNewUser(data);
              setShowModal(false);
              setShowOtpModal(true);
            }}
          />

          {/* OTP Modal */}
          <OtpModalDark
            isOpen={showOtpModal}
            onClose={() => setShowOtpModal(false)}
            context="register"
            email={newUser?.email}
            onVerified={(userId) => {
              handleMechanicRegister(userId);
            }}
          />

          {/* Table with glass effect */}
          <AdminTable
            data={mechanics}
            columns={columns}
            renderActions={(m) => {
              return (
                <div className="flex gap-3">
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

export default GarageMechanic;
