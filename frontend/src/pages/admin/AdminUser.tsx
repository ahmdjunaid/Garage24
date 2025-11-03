import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import AdminHeader from "../../components/elements/AdminHeader";
import { fetchAllUsersApi, toggleStatusApi } from "../../services/admin";
import profilePlaceholder from "../../assets/icons/profile-placeholder.jpg";
import _ from "lodash";
import type { IUsersMappedData } from "../../types/UserTypes";
import { errorToast, successToast } from "../../utils/notificationAudio";
import type { TableColumn } from "../../components/elements/AdminTable";
import AdminTable from "../../components/elements/AdminTable";
import type { ActionPayload } from "../../types/CommonTypes";
import { ConfirmModal } from "../../components/modal/ConfirmModal";

const AdminUser = () => {
  const [users, setUsers] = useState<IUsersMappedData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [action, setAction] = useState<ActionPayload | null>(null);
  const usersPerPage = 5;

  const { token } = useSelector((state: RootState) => state.auth);

  const fetchUsers = useCallback(
    async (currentPage: number, searchQuery: string, token: string | null) => {
      try {
        const response = await fetchAllUsersApi(
          currentPage,
          usersPerPage,
          searchQuery,
          token
        );
        setUsers(response.users);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      }
    },
    [usersPerPage]
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string, token: string | null) => {
        fetchUsers(page, query, token);
      }, 300),
    [fetchUsers]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchUsers(currentPage, "", token);
    } else {
      debouncedFetch(currentPage, searchQuery, token);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, token, fetchUsers, debouncedFetch]);

  const handleConfirm = async () => {

    if(!action) return

    try {
      await toggleStatusApi(action.id, action.action, token);
      setUsers((prev) =>
        prev.map((m) =>
          m._id === action.id ? { ...m, isBlocked: action.action === "block" } : m
        )
      );
      successToast(`${action.action}ed successfull`);
    } catch (error) {
      if(error instanceof Error)
      errorToast(error.message);
      console.error(error);
    }
  };

  const columns: TableColumn<IUsersMappedData>[] = [
    { key: "userId", label: "ID" },
    {
      key: "imageUrl",
      label: "Image",
      render: (u) => (
        <img
          src={u.imageUrl || profilePlaceholder}
          className="w-10 h-10 rounded-full ring-2 ring-gray-700"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "isBlocked",
      label: "Status",
      render: (u) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            u.isBlocked
              ? "bg-red-900 text-red-300"
              : "bg-green-900 text-green-300"
          }`}
        >
          {u.isBlocked ? "Inactive" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          text={"Users"}
          searchPlaceholder={"Search user..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          {/* Table with glass effect */}
          <AdminTable
            data={users}
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

export default AdminUser;
