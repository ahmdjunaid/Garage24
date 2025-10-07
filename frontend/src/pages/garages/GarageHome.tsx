import React, { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import AdminTable from "../../components/elements/AdminTable";
import DarkModal from "../../components/modal/DarkModal";
import { resendOtpApi, SignUpApi, verifyOtpApi } from "../../services/auth";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { registerMechanicApi } from "../../services/garage";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";

const GarageHome = () => {
  const [mechanics, setMechanics] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [seconds, setSeconds] = useState<number>(0);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("")

  const { user,token } = useSelector((state:RootState)=>state.auth)
  const garageId = user?._id

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleSubmit = async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    let hasError = false;

    const nameRegex = /^[A-Za-z]{3,}(?: [A-Za-z]+)*$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!nameRegex.test(name)) {
      setNameError("Enter a valid name.");
      hasError = true;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address.");
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (!hasError) {
      try {
        const res = await SignUpApi({ name, email, password, role: "mechanic" });

        setUserId(res.user?._id)

        setTimeout(() => {
          setShowModal(!showModal);
          setName("");
          setPassword("");
          setShowOtpModal(true);
          setSeconds(120)
          setOtpError("")
        }, 2000);

      } catch (error: any) {
        console.error(error.message)
        errorToast("Error while creating mechanic");
      }
    }
  };

  const handleOtp = async () => {
    setOtpError("");
    try {
      const otpRegex = /^\d{6}$/;
      if (!otpRegex.test(otp)) {
        setOtpError("OTP must be a 6-digit number.");
        return;
      }

      await verifyOtpApi({ email, otp });

      handleMechanicRegister()

      setTimeout(() => {
        setShowOtpModal(!showOtpModal);
        setOtp("");
        setEmail("")
      }, 1000);
    } catch (error: any) {
      console.error("error on verifying Otp", error.message);
      setOtpError(error.message || "something went wrong");
    }
  };

  const handleMechanicRegister = async ()=>{
    try {
      await registerMechanicApi({garageId,userId},token)
      successToast("Mechanic account created successfully.");
    } catch (error) {
      errorToast(error.message || "Error while creating new mechanic")
    }
  }

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      await resendOtpApi({ email });
      setSeconds(120);

      successToast("OTP has been resent successfully.");

      setTimeout(() => {
        setResendDisabled(false);
      }, 10000);
    } catch (error: any) {
      console.error(error);
      setOtpError(error.message || "Error while resend OTP.");
      setResendDisabled(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
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
              Mechanics
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="bg-black bg-opacity-30 backdrop-blur-md border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                />
              </div>
              <button className="relative p-2 hover:bg-red-800 hover:bg-opacity-50 rounded-lg transition-all group">
                <Bell className="w-5 h-5 group-hover:animate-bounce" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

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

          <DarkModal
            isOpen={showModal}
            onClose={() => setShowModal(!showModal)}
          >
            <div className="text-white mt-5 rounded-2xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-6">Add Mechanic</h2>
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium">Name:</label>
                <input
                  type="text"
                  placeholder="Enter full-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
                />
                {nameError ? (
                  <p className="text-red-600 font-light text-sm ">
                    {nameError}
                  </p>
                ) : (
                  ""
                )}
              </div>

              {/* Login credentials */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Login credentials:</h3>

                {/* Email */}
                <label className="block mb-2 text-sm font-medium">
                  Email ID:
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
                />
                {emailError ? (
                  <p className="text-red-600 font-light text-sm ">
                    {emailError}
                  </p>
                ) : (
                  ""
                )}

                {/* Password */}
                <label className="block mt-6 mb-2 text-sm font-medium">
                  One-Time Password:
                </label>
                <input
                  type="text"
                  placeholder="Enter a temporory password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
                />
                {passwordError ? (
                  <p className="text-red-600 font-light text-sm ">
                    {passwordError}
                  </p>
                ) : (
                  ""
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(!showModal)}
                  className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-neutral-900 transition"
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
                  onClick={handleSubmit}
                >
                  Add Mechanic
                </button>
              </div>
            </div>
          </DarkModal>

          {/* Otp modal */}
          <DarkModal
            isOpen={showOtpModal}
            onClose={() => setShowOtpModal(!showOtpModal)}
          >
            <div className="flex flex-col space-y-4">
              <p className="text-center text-white/50 font-bold">
                OTP Verification
              </p>
              {otpError && (
                <div className="border border-red-600 p-2 rounded-lg mb-2">
                  <p className="text-red-600 text-center text-sm">{otpError}</p>
                </div>
              )}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
              />
              <button
                className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
                onClick={handleOtp}
                disabled={seconds > 0 ? false : true}
              >
                Verify OTP
              </button>
              {seconds > 0 ? (
                <p className="text-center text-white/50 font-light">
                  {seconds} Seconds Left
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className="text-center text-white/50 font-bold hover:text-red-500"
                >
                  {resendDisabled ? "Please wait..." : "Resend OTP"}
                </button>
              )}
            </div>
          </DarkModal>

          {/* Table with glass effect */}
          <AdminTable mechanics={mechanics} />
        </div>
      </div>
    </div>
  );
};

export default GarageHome;
