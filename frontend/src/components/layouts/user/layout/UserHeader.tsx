import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { logoutApi } from "@/services/authServices";
import { logout } from "@/redux/slice/userSlice";
import userBanner from "@assets/banner/userMainbBanner.jpg";
import blackLogo from "@assets/icons/Logo.png";
import whiteLogo from "@assets/icons/logo-white.png";
import { Link } from "react-router-dom";

interface HeaderProps {
  showCta?: boolean;
  ctaSize?: "full" | "half";
  handleAppointmentClick?: ()=> void
}

const UserHeader = ({ showCta = false, ctaSize = "half", handleAppointmentClick}: HeaderProps) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await logoutApi();
    if (result.success) {
      dispatch(logout());
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${
        ctaSize === "full" ? "min-h-screen" : "min-h-[20vh]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
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
              <Link to="/" className="text-base hover:text-gray-300">
                Home
              </Link>

              <Link to="/my-garage" className="text-base hover:text-gray-300">
                My Garage
              </Link>

              {/* More Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-base hover:text-gray-300"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                >
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showMoreMenu && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg py-2 z-50">
                    <a
                      href="#profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <Link
                      to="/appointment"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Appointments
                    </Link>
                    <a
                      href="#services"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Services
                    </a>
                    <a
                      href="#about"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About
                    </a>
                    <a
                      href="#contact"
                      className="block px-4 py-2 hover:bg-gray-100"
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
              src={ ctaSize==="full" ? blackLogo : whiteLogo}
              alt="Garage24 Logo"
            />
          </div>

          {/* Right Button */}
          <div className="flex justify-end">
            {!user ? (
              <Link
                to="/login"
                className="bg-red-500 hover:bg-red-600 text-white
                px-5 sm:px-8 py-2 sm:py-2.5 rounded-md font-medium text-sm sm:text-base"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white
                px-5 sm:px-8 py-2 sm:py-2.5 rounded-md font-medium text-sm sm:text-base"
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        {showMobileMenu && (
          <div className="lg:hidden mx-5 w-50 bg-black/50 text-white px-6 py-4 space-y-4">
            <Link to="/" className="block hover:text-gray-300">
              Home
            </Link>

            <a href="#profile" className="block hover:text-gray-300">
              Profile
            </a>

            <Link to="/my-garage" className="block hover:text-gray-300">
              My Garage
            </Link>

            <Link to="/appointment" className="block hover:text-gray-300">
              My Appointments
            </Link>

            <a href="#services" className="block hover:text-gray-300">
              Services
            </a>

            <a href="#about" className="block hover:text-gray-300">
              About
            </a>

            <a href="#contact" className="block hover:text-gray-300">
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
                  onClick={()=>handleAppointmentClick?.()}
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
  );
};

export default UserHeader;
