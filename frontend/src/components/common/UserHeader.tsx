import { useState, useEffect, useMemo } from "react";
import { Bell, ChevronDown, LogInIcon, LogOutIcon, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { logoutApi } from "@/features/auth/services/authServices";
import { logout } from "@/redux/slice/userSlice";
import userBanner from "@assets/banner/userMainbBanner.jpg";
import blackLogo from "@assets/icons/Logo.png";
import whiteLogo from "@assets/icons/logo-white.png";
import { Link, useLocation } from "react-router-dom";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { socket } from "@/lib/socket";
import { markAllAsRead, markAsRead } from "@/redux/slice/notificationSlice";
import { markAllAsReadApi, markAsReadApi } from "../services/notificationServices";

interface HeaderProps {
  showCta?: boolean;
  ctaSize?: "full" | "half";
  handleAppointmentClick?: () => void;
}

const UserHeader = ({
  showCta = false,
  ctaSize = "half",
  handleAppointmentClick,
}: HeaderProps) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      socket.disconnect();
      successToast("Logged out!");
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

    const handleMarkRead = async (notfId:string) => {
      try {
        await markAsReadApi(notfId)
        dispatch(markAsRead(notfId))
      } catch (error) {
        if(error instanceof Error)
          errorToast(error.message)
      }
    }
  
    const handleMarkAllRead = async () => {
      try {
        await markAllAsReadApi()
        dispatch(markAllAsRead())
      } catch (error) {
        if(error instanceof Error)
          errorToast(error.message)
      }
    }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm transition-all duration-300 z-[100] ${
          isScrolled ? "translate-y-0 shadow-lg" : "-translate-y-full"
        }`}
      >
        <div className="grid grid-cols-3 items-center px-4 sm:px-8 lg:px-16 py-3 gap-4">
          <div className="flex items-center text-white justify-start gap-4">
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm hover:text-gray-300 ${isActive("/") ? "text-red-500" : ""}`}
              >
                Home
              </Link>

              <Link
                to="/my-garage"
                className={`text-sm hover:text-gray-300 ${isActive("/my-garage") ? "text-red-500" : ""}`}
              >
                My Garage
              </Link>

              {/* More Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-sm hover:text-gray-300"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                >
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showMoreMenu && isScrolled && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg py-2 z-[200]">
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 hover:bg-gray-100 ${isActive("/profile") ? "text-red-500" : ""}`}
                      onClick={() => setShowMoreMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-appointments"
                      className={`block px-4 py-2 hover:bg-gray-100 ${isActive("/my-appointments") ? "text-red-500" : ""}`}
                      onClick={() => setShowMoreMenu(false)}
                    >
                      My Appointments
                    </Link>
                    <a
                      href="#services"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      Services
                    </a>
                    <a
                      href="#about"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      About
                    </a>
                    <a
                      href="#contact"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      Contact
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center">
            <img
              className="w-28 sm:w-32 lg:w-40 h-auto"
              src={whiteLogo}
              alt="Garage24 Logo"
            />
          </div>

          {/* Right Button */}
          <div className="flex justify-end">
            {!user ? (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl text-white text-sm font-bold tracking-wider uppercase transition-all duration-200"
              >
                <LogInIcon size={16}/>
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className={`relative p-2.5 rounded-xl border transition-all duration-200
                    ${
                      showNotifications
                        ? "bg-red-600/20 border-red-500 text-red-400"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-red-600/15 hover:border-red-500/40 hover:text-red-400"
                    }`}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 border-2 border-zinc-950 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* ── Logout Button ── */}
                <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl text-white text-sm font-bold tracking-wider uppercase transition-all duration-200">
                  <LogOutIcon size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN for Fixed Nav */}
        {showMobileMenu && isScrolled && (
          <div className="lg:hidden bg-black/95 text-white px-6 py-4 space-y-3 border-t border-gray-700">
            <Link
              to="/"
              className={`block hover:text-gray-300 ${isActive("/") ? "text-red-500" : ""}`}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className={`block hover:text-gray-300 ${isActive("/profile") ? "text-red-500" : ""}`}
              onClick={() => setShowMobileMenu(false)}
            >
              Profile
            </Link>
            <Link
              to="/my-garage"
              className={`block hover:text-gray-300 ${isActive("/my-garage") ? "text-red-500" : ""}`}
              onClick={() => setShowMobileMenu(false)}
            >
              My Garage
            </Link>
            <Link
              to="/my-appointments"
              className={`block hover:text-gray-300 ${isActive("/my-appointments") ? "text-red-500" : ""}`}
              onClick={() => setShowMobileMenu(false)}
            >
              My Appointments
            </Link>
            <a
              href="#services"
              className="block hover:text-gray-300"
              onClick={() => setShowMobileMenu(false)}
            >
              Services
            </a>
            <a
              href="#about"
              className="block hover:text-gray-300"
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="block hover:text-gray-300"
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </a>
          </div>
        )}
      </nav>

      {/* MAIN HEADER */}
      <div
        className={`relative w-full overflow-visible ${
          ctaSize === "full" ? "min-h-screen" : "min-h-[20vh]"
        }`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={userBanner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content Container */}
        <div
          className={`relative z-10 ${ctaSize === "full" ? "min-h-screen" : "min-h-[20vh]"} flex flex-col`}
        >
          {/* NAVBAR */}
          <nav className="grid grid-cols-3 items-center px-4 sm:px-8 lg:px-16 py-4 lg:py-6 gap-4">
            {/* LEFT MENU (Desktop + Mobile) */}
            <div className="flex items-center text-white justify-start gap-4">
              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  to="/"
                  className={`text-base hover:text-gray-300 ${isActive("/") ? "text-red-500" : ""}`}
                >
                  Home
                </Link>

                <Link
                  to="/my-garage"
                  className={`text-base hover:text-gray-300 ${isActive("/my-garage") ? "text-red-500" : ""}`}
                >
                  My Garage
                </Link>

                {/* More Dropdown */}
                <div className="relative z-50">
                  <button
                    className="flex items-center space-x-1 text-base hover:text-gray-300"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                  >
                    <span>More</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showMoreMenu && !isScrolled && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg py-2 z-[200]">
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 hover:bg-gray-100 ${isActive("/profile") ? "text-red-500" : ""}`}
                        onClick={() => setShowMoreMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-appointments"
                        className={`block px-4 py-2 hover:bg-gray-100 ${isActive("/my-appointments") ? "text-red-500" : ""}`}
                        onClick={() => setShowMoreMenu(false)}
                      >
                        My Appointments
                      </Link>
                      <a
                        href="#services"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowMoreMenu(false)}
                      >
                        Services
                      </a>
                      <a
                        href="#about"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowMoreMenu(false)}
                      >
                        About
                      </a>
                      <a
                        href="#contact"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowMoreMenu(false)}
                      >
                        Contact
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden text-white focus:outline-none"
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex items-center justify-start lg:justify-center">
              <img
                className="w-36 sm:w-44 lg:w-56 h-auto"
                src={ctaSize === "full" ? blackLogo : whiteLogo}
                alt="Garage24 Logo"
              />
            </div>

            {/* Right Button */}
            <div className="flex justify-end">
              {!user ? (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl text-white text-sm font-bold tracking-wider uppercase transition-all duration-200"
                >
                  <LogInIcon size={16}/>
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-3 relative">
                  {/* ── Bell Button ── */}
                  <button
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className={`relative p-2.5 rounded-xl border transition-all duration-200
                    ${
                      showNotifications
                        ? "bg-red-600/20 border-red-500 text-red-400"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-red-600/15 hover:border-red-500/40 hover:text-red-400"
                    }`}
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 border-2 border-zinc-950 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* ── Logout Button ── */}
                  <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl text-white text-sm font-bold tracking-wider uppercase transition-all duration-200">
                    <LogOutIcon size={16} />
                    Logout
                  </button>

                  {/* ── Dropdown Panel ── */}
                  {showNotifications && (
                    <div className="fixed top-[72px] right-4 sm:right-8 lg:right-16 w-[380px] bg-zinc-900 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-[9999]">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] bg-gradient-to-r from-red-600/10 to-transparent">
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                          <span className="text-white font-bold text-sm tracking-[2px] uppercase">
                            Notifications
                          </span>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => handleMarkAllRead()}
                            className="text-[11px] font-medium text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 tracking-wide"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Body */}
                      {unreadCount === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-5 text-white/35 text-sm gap-2">
                          <span className="text-4xl">🎉</span>
                          You're all caught up!
                        </div>
                      ) : (
                        <div className="max-h-[380px] overflow-y-auto p-2">
                          {notifications
                            .filter((n) => !n.isRead)
                            .map((n) => (
                              <div
                                key={n._id}
                                className="relative flex gap-3 items-start p-3.5 rounded-2xl mb-1.5 last:mb-0 bg-zinc-800 border border-red-600/15 hover:bg-zinc-700/60 hover:border-red-600/30 transition-all duration-200 group"
                              >
                                {/* Left red strip */}
                                <span className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-red-600 rounded-r-full" />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-bold text-white/90 tracking-wide mb-1 truncate">
                                    {n.title}
                                  </p>
                                  <p className="text-[12px] text-white/50 leading-relaxed line-clamp-2">
                                    {n.message}
                                  </p>

                                  {/* Confirmed-style pill — matches appointment card */}
                                  <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-red-600/15 border border-red-500/30 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    <span className="text-[10px] font-semibold text-red-400 uppercase tracking-[0.8px]">
                                      Unread
                                    </span>
                                  </div>

                                  {/* Mark as read — appears on hover */}
                                  <button
                                    onClick={() => handleMarkRead(n._id)}
                                    className="mt-2 flex items-center gap-1 text-[11px] text-red-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                  >
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Mark as read
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="px-5 py-3 border-t border-white/[0.06] text-center text-[11px] text-white/20 tracking-widest uppercase">
                        Garage24 · Notifications
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* MOBILE MENU DROPDOWN */}
          {showMobileMenu && !isScrolled && (
            <div className="lg:hidden mx-5 w-50 bg-black/50 text-white px-6 py-4 space-y-4 z-40">
              <Link
                to="/"
                className={`block hover:text-gray-300 ${isActive("/") ? "text-red-500" : ""}`}
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>

              <Link
                to="/profile"
                className={`block hover:text-gray-300 ${isActive("/profile") ? "text-red-500" : ""}`}
                onClick={() => setShowMobileMenu(false)}
              >
                Profile
              </Link>

              <Link
                to="/my-garage"
                className={`block hover:text-gray-300 ${isActive("/my-garage") ? "text-red-500" : ""}`}
                onClick={() => setShowMobileMenu(false)}
              >
                My Garage
              </Link>

              <Link
                to="/appointment"
                className={`block hover:text-gray-300 ${isActive("/appointment") ? "text-red-500" : ""}`}
                onClick={() => setShowMobileMenu(false)}
              >
                My Appointments
              </Link>

              <a
                href="#services"
                className="block hover:text-gray-300"
                onClick={() => setShowMobileMenu(false)}
              >
                Services
              </a>

              <a
                href="#about"
                className="block hover:text-gray-300"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </a>

              <a
                href="#contact"
                className="block hover:text-gray-300"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </a>
            </div>
          )}

          {/* HERO SECTION */}
          {showCta && (
            <div className="flex-1 flex items-center px-4 sm:px-8 lg:px-16">
              <div className="max-w-7xl w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center text-center lg:text-left">
                  {/* Left Side - Hero Text */}
                  <div>
                    <h1
                      className="text-white text-3xl sm:text-4xl lg:text-6xl xl:text-7xl
                    font-bold leading-tight mb-6 sm:mb-8"
                    >
                      Drive Confidently with{" "}
                      <span className="text-red-500">GARAGE24</span>
                    </h1>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white
                    px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-medium text-base sm:text-lg"
                      onClick={() => handleAppointmentClick?.()}
                    >
                      Appointment Now
                    </button>
                  </div>

                  {/* Right Side - Description */}
                  <div className="lg:ml-auto lg:max-w-md">
                    <div className="p-4 sm:p-6 lg:p-8 rounded-lg">
                      <p className="text-white text-base sm:text-lg leading-relaxed">
                        Your car deserves the best care, and we deliver it with
                        precision, speed, and reliability. Book your appointment
                        today!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserHeader;
