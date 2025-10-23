import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import AdminHeader from "../../components/elements/AdminHeader";
import { Filter, ChevronDown } from "lucide-react";
import { fetchAllUsersApi, toggleStatusApi } from "../../services/admin";
import profilePlaceholder from "../../assets/icons/profile-placeholder.jpg";
import _ from "lodash"
import type { IUsersMappedData } from "../../types/UserTypes";
import { errorToast, successToast } from "../../utils/notificationAudio";

const AdminUser = () => {
  const [users, setUsers] = useState<IUsersMappedData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
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
  
    const handleBlock = async (userId: string, action: string) => {
      try {
        await toggleStatusApi(userId, action, token);
        setUsers((prev) =>
          prev.map((m) =>
            m._id === userId ? { ...m, isBlocked: action === "Block" } : m
          )
        );
        successToast(`${action}ed successfull`);
      } catch (error: any) {
        console.error(error);
        errorToast(error.message);
      }
    };

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
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm">
            {/* Table Controls */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-950">
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105">
                <Filter className="w-4 h-4" />
                Filter By
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105">
                Sort By: {sortBy}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-800 text-xs text-gray-500 font-semibold uppercase bg-gradient-to-r from-gray-900 to-gray-950">
              <div>User ID</div>
              <div>Image</div>
              <div>Name</div>
              <div>Email</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* Table Body */}
            <div>
              {users.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 items-center group cursor-pointer"
                >
                  <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
                    {user.userId}
                  </div>
                  <div>
                    <img
                      src={
                        user.imageUrl
                          ? user.imageUrl
                          : profilePlaceholder
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full bg-gray-700 ring-2 ring-gray-700 group-hover:ring-red-600 transition-all"
                    />
                  </div>
                  <div className="text-white font-medium group-hover:text-red-400 transition-colors">
                    {user.name}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-200 transition-colors truncate max-w-[200px]"
                  title={user.email}
                  >{user.email}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        user.isBlocked
                          ? "bg-gradient-to-r from-red-900 to-red-800 text-red-300 shadow-lg shadow-red-900/50"
                          : "bg-gradient-to-r from-green-900 to-green-800 text-green-300 shadow-lg shadow-green-900/50"
                      }`}
                    >
                      {user.isBlocked
                        ? "Inactive"
                        : "Active"}
                    </span>
                  </div>
                  <div>
                    <button
                      className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-all hover:scale-110 me-3"
                      onClick={() => handleBlock(
                          user._id,
                          user.isBlocked ? "Unblock" : "Block"
                        )
                      }
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

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