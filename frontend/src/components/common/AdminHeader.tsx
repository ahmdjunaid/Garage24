import React from "react";
import { Search, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { markAllAsRead, markAsRead } from "@/redux/slice/notificationSlice";

interface AdminHeaderProps {
  text: string;
  searchPlaceholder?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  text,
  searchPlaceholder,
  setSearchQuery,
}) => {
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );
  const [showNotifications, setShowNotifications] = React.useState(false);

  const dispatch = useDispatch();

  const unreadCount = React.useMemo(() => {
  return notifications.filter((n) => !n.isRead).length;
}, [notifications]);

  return (
    <div className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-800 px-8 py-8 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          {text}
        </h1>
        <div className="flex items-center gap-4">
          {searchPlaceholder ? (
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="bg-black bg-opacity-30 backdrop-blur-md border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                onChange={(e) => setSearchQuery?.(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 hover:bg-red-800 hover:bg-opacity-50 rounded-lg transition-all group"
          >
            <Bell className="w-5 h-5 group-hover:animate-bounce" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              className="
      fixed right-8 top-20 w-96
      bg-gradient-to-br from-gray-950 via-gray-900 to-black
      text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      border border-gray-800
      backdrop-blur-xl
      max-h-[450px] overflow-hidden
      z-[9999]
    "
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold tracking-wide">
                  Notifications
                </h2>

                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="max-h-[380px] overflow-y-auto">
                {unreadCount === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    You're all caught up 🎉
                  </div>
                ) : (
                  notifications
                    .filter((notification) => !notification.isRead)
                    .map((notification) => (
                      <div
                        key={notification._id}
                        className="
                          group relative px-5 py-4
                          border-b border-gray-800
                          hover:bg-red-900/20
                          transition-all duration-200
                        "
                      >
                        {/* Unread dot */}
                        {!notification.isRead && (
                          <span className="absolute left-2 top-6 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}

                        <div className="ml-3">
                          <p className="font-semibold text-sm">
                            {notification.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {notification.message}
                          </p>

                          {/* Mark as read button */}
                          {!notification.isRead && (
                            <button
                              onClick={() =>
                                dispatch(markAsRead(notification._id))
                              }
                              className="
                                mt-3 text-xs
                                text-red-400 hover:text-red-300
                                opacity-0 group-hover:opacity-100
                                transition
                              "
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
