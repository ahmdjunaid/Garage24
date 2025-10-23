import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import AdminTable from "../../components/elements/AdminTable";
import DarkModal from "../../components/modal/Layout/DarkModal";
import { resendOtpApi, signUpApi, verifyOtpApi } from "../../services/auth";
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
import Spinner from "../../components/elements/Spinner";

const GarageMechanic = () => {
  const [mechanics, setMechanics] = useState<IMechanic[]>([]);
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
  const [userId, setUserId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)
  const mechanicsPerPage = 5;

  const { user, token } = useSelector((state: RootState) => state.auth);
  const garageId = user?._id;

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
        setLoading(true)

        const res = await signUpApi({
          name,
          email,
          password,
          role: "mechanic",
        });

        setUserId(res.user?._id);
        setTimeout(() => {
          setShowModal(!showModal);
          setName("");
          setEmail("");
          setPassword("");
          setLoading(false)
          setShowOtpModal(true);
          setSeconds(120);
          setOtpError("");
        }, 2000);
      } catch (error: any) {
        console.error(error.message);
        errorToast("Error while creating mechanic");
        setLoading(false)
      } finally {
        setLoading(false)
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

      handleMechanicRegister();

      setTimeout(() => {
        setShowOtpModal(!showOtpModal);
        setOtp("");
        setEmail("");
      }, 1000);
    } catch (error: any) {
      console.error("error on verifying Otp", error.message);
      setOtpError(error.message || "something went wrong");
    }
  };

  const handleMechanicRegister = async () => {
    try {
      await registerMechanicApi({ garageId, userId }, token);
      successToast("Mechanic account created successfully.");
      fetchMechanics(currentPage, searchQuery, token);
    } catch (error) {
      errorToast(error.message || "Error while creating new mechanic");
    }
  };

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

  const fetchMechanics = useCallback(
    async (currentPage: number, searchQuery: string, token: string | null) => {
      try {
        const response = await fetchMechanicsApi(
          currentPage,
          mechanicsPerPage,
          searchQuery,
          token
        );
        setMechanics(response.mechanics);
        setTotalPages(response.totalPages);
        console.log("Fetched mechanics:", response.mechanics);
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
  }, [currentPage, searchQuery, token, fetchMechanics, debouncedFetch]);

  const handleBlock = async (userId: string, action: string) => {
    try {
      await toggleUserStatusApi(userId, action, token);
      setMechanics((prev) =>
        prev.map((m) =>
          m.userId === userId ? { ...m, isBlocked: action === "Block" } : m
        )
      );
      successToast(`${action}ed successfull`);
    } catch (error: any) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteMechanic(userId, token);
      setMechanics(prev => prev.filter(m => m.userId !== userId))
      successToast(`Deleted successfull`);
    } catch (error: any) {
      console.error(error);
      errorToast(error.message);
    }
  };

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
                  disabled={loading}
                >
                  {loading ? "Loading" : "Add Mechanic"}
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

          <Spinner loading={loading} />

          {/* Table with glass effect */}
          <AdminTable
            mechanics={mechanics}
            onBlock={handleBlock}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="px-6 py-5 flex items-center justify-center gap-4">
            <button
              className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30"
              onClick={() => setCurrentPage((c) => c > 1 ? c - 1 : c)}
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
              onClick={() => setCurrentPage((c) => c < totalPages ? c + 1 : c)}
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
