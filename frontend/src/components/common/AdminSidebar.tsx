import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageSquare, ChevronRight, Menu, X, LogOut } from "lucide-react";
import whiteLogo from "@assets/icons/logo-white.png";
import { logoutApi } from "@/features/auth/services/authServices";
import { logout } from "@/redux/slice/userSlice";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { useDispatch, useSelector } from "react-redux";
import { getMenuItems } from "@/constants/menuItems";
import type { RootState } from "@/redux/store/store";
import profileIcon from "@assets/icons/profileIcon.png";
import { socket } from "@/lib/socket";

export interface AdminSidebarProps {
  role: "garage" | "mechanic" | "admin" | "user";
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ role }) => {
  const menuItems = getMenuItems(role);
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.auth);
  const { totalUnread } = useSelector((state: RootState) => state.chat);

  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const otherItems = [
    {
      name: "Messages",
      path: `/${role}/messages`,
      icon: MessageSquare,
      badge: totalUnread,
    },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutApi();
      dispatch(logout());
      socket.disconnect();
      successToast("Logout successful.");
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50">
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu className="w-7 h-7" />
        </button>

        <img src={whiteLogo} className="h-8" />

        <div className="w-7 h-7" />
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0
          z-50
          h-screen
          w-[85vw] sm:w-[70vw] md:w-[320px] lg:w-64
          bg-gradient-to-b from-gray-950 to-black
          border-r border-gray-800
          shadow-xl
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* CLOSE BUTTON (MOBILE) */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* LOGO (DESKTOP) */}
        <div className="hidden lg:flex justify-center py-6">
          <img className="w-36" src={whiteLogo} alt="Logo" />
        </div>

        {/* MENU */}
        <div className="flex-1 px-4 overflow-y-auto pt-4 lg:pt-0 scrollbar-thin scrollbar-thumb-gray-700">
          <div className="text-xs text-gray-600 font-semibold mb-3 px-3 tracking-wider">
            MENU
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow"
                      : "text-gray-400 hover:bg-gray-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="text-xs text-gray-600 font-semibold mb-3 px-3 mt-8 tracking-wider">
            OTHERS
          </div>

          {role !== "admin" &&
            otherItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow"
                      : "text-gray-400 hover:bg-gray-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>

                {item.badge > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
        </div>

        {/* PROFILE + LOGOUT */}
        <div className="p-4 border-t border-gray-800">
          <NavLink
            to={`/${role}/profile`}
            className={({ isActive }) =>
              `flex items-center gap-3 mb-4 p-3 rounded-lg ${
                isActive ? "bg-red-700" : ""
              }`
            }
          >
            <img
              src={user?.imageUrl ? user?.imageUrl : profileIcon}
              alt="Profile"
              className="w-10 h-10 rounded-full bg-gray-600 ring-2 ring-red-600"
            />

            <div className="flex-1">
              <div className="font-semibold text-sm">{user?.name}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                View Profile
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2
              text-red-400 hover:text-white
              border border-red-600 hover:bg-red-600
              rounded-lg py-2 transition"
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;