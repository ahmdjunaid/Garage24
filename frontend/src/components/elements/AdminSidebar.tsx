import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {

  MessageSquare,
  ChevronRight,
} from "lucide-react";
import whiteLogo from "../../assets/icons/logo-white.png";
import { logoutApi } from "../../services/auth";
import { logout } from "../../redux/slice/userSlice";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { useDispatch } from "react-redux";
import { getMenuItems } from "../../constants/menuItems";

interface AdminSidebarProps {
  role: "garage" | "mechanic" | "admin"
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({role}) => {

const menuItems = getMenuItems(role)

  const dispatch = useDispatch()

  const otherItems = [
    {
      name: "Messages",
      path:  `/${role}/messages`,
      icon: MessageSquare,
      badge: 10,
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout())
      successToast("Logout successfull.")
    } catch (error:any) {
      console.error(error);
      errorToast(error.message)
    }
  };

  return (
    <div className="w-60 bg-gradient-to-b from-gray-950 to-black flex flex-col border-r border-gray-800 shadow-2xl">
      {/* Logo */}
      <div className="mx-auto p-6">
        <img className="w-58" src={whiteLogo} alt="Logo" />
      </div>

      {/* Menu */}
      <div className="flex-1 px-4">
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50"
                    : "text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900"
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 group-hover:scale-110 transition-transform`}/>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="text-xs text-gray-600 font-semibold mb-3 px-3 mt-8 tracking-wider">
          OTHERS
        </div>
        {otherItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50"
                  : "text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-auto bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Profile */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all duration-200 border border-gray-700 shadow-xl">
          {/* <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=KR"
            alt="Profile"
            className="w-10 h-10 rounded-full bg-gray-600 ring-2 ring-red-600"
          /> */}
          {/* <div className="flex-1">
            <div className="font-semibold text-sm">KR Garage</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-red-400 transition-colors">
              View Profile <ChevronRight className="w-3 h-3" />
            </div>
          </div> */}

          {/* temporary div */}
          <div className="flex-1">
            <div className="font-semibold text-xl text-red-600 flex justify-center"
            onClick={handleLogout}
            >
              <h1>Logout</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
