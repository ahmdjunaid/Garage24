import React from "react";
import { Search, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { markAllAsRead, markAsRead } from "@/redux/slice/notificationSlice";
import { errorToast } from "@/utils/notificationAudio";
import {
  markAllAsReadApi,
  markAsReadApi,
} from "../services/notificationServices";

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
  const notifRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const handleMarkRead = async (notfId: string) => {
    try {
      await markAsReadApi(notfId);
      dispatch(markAsRead(notfId));
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadApi();
      dispatch(markAllAsRead());
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-800">
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Single row for all screen sizes */}
      <div className="relative flex items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6">

        {/* Title — pl-10 on mobile clears the hamburger button */}
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold pl-10 lg:pl-0 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
          {text}
        </h1>

        {/* Right side actions */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Search bar — desktop (sm+) inline */}
          {searchPlaceholder && (
            <div className="relative group hidden sm:flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-64 lg:w-72 bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 transition-all placeholder-gray-500"
                onChange={(e) => setSearchQuery?.(e.target.value)}
              />
            </div>
          )}

          {/* Search icon — mobile only, expands below */}
          {searchPlaceholder && (
            <MobileSearchToggle
              searchPlaceholder={searchPlaceholder}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-all group"
            >
              <Bell className="w-5 h-5 text-white group-hover:animate-bounce" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="
                fixed top-16 sm:top-20
                left-2 right-2
                sm:left-auto sm:right-8 sm:w-96
                bg-gradient-to-br from-gray-950 via-gray-900 to-black
                text-white rounded-2xl
                shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                border border-gray-800
                max-h-[70vh] overflow-hidden
                z-[9999]
              ">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                  <h2 className="text-base font-semibold tracking-wide">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                  {unreadCount === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      You're all caught up 🎉
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.isRead)
                      .map((notification) => (
                        <div
                          key={notification._id}
                          className="group relative px-5 py-4 border-b border-gray-800 hover:bg-red-900/20 transition-all duration-200"
                        >
                          <span className="absolute left-2 top-6 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <div className="ml-3">
                            <p className="font-semibold text-sm">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <button
                              onClick={() => handleMarkRead(notification._id)}
                              className="mt-2 text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                            >
                              Mark as read
                            </button>
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
    </div>
  );
};

/* Mobile search: icon → expands full-width bar below header */
const MobileSearchToggle: React.FC<{
  searchPlaceholder: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}> = ({ searchPlaceholder, setSearchQuery }) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((p) => !p)}
        className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
        aria-label="Toggle search"
      >
        <Search className={`w-5 h-5 transition-colors ${open ? "text-red-300" : "text-white"}`} />
      </button>

      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-full px-4 py-3 bg-red-950/95 backdrop-blur-sm border-t border-white/10 z-20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/40 transition-all placeholder-gray-500"
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;