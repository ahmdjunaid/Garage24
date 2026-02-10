import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface IAddress {
  city: string;
  district: string;
  state: string;
  pincode: string;
  displayName: string;
}

interface AppointmentSuccessProps {
  bookingNumber: string;
  garageName: string;
  address: IAddress;
  date: string;
  time: string;
}

const AppointmentSuccess: React.FC<AppointmentSuccessProps> = ({
  bookingNumber,
  garageName,
  address,
  date,
  time,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border border-[#3a3a3a] rounded-2xl shadow-2xl m-10 p-10 animate-fadeIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping" />
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-[0_10px_40px_rgba(76,175,80,0.4)]">
              <svg
                viewBox="0 0 52 52"
                className="w-12 h-12 stroke-white"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 27l9 9 19-19" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Thank you! Your service appointment is scheduled.
          </h1>
          <p className="text-sm text-gray-400">
            Booking Reference No.{" "}
            <span className="font-medium">{bookingNumber}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate("/my-appointments")}
            className="px-8 py-3 rounded-xl bg-[#1a1a1a] border border-[#4a4a4a] text-white font-semibold hover:bg-[#2a2a2a] hover:-translate-y-0.5 transition-all"
          >
            Appointment Status
          </button>
        </div>

        {/* Appointment Details */}
        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6">
          <h2 className="text-center text-lg font-semibold text-white tracking-wide mb-6">
            Appointment Details
          </h2>

          {/* Location */}
          <DetailItem label="Location" value={garageName} />

          {/* Date */}
          <DetailItem label="Date" value={new Date(date).toLocaleDateString()} />

          {/* Time */}
          <DetailItem label="Time" value={time} />

          <div className="flex items-center gap-4 bg-[#262626] border-l-4 border-green-500 rounded-lg p-4 mb-4 last:mb-0 shadow-md hover:translate-x-1 transition-all">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Address
              </p>
              <p className="text-white text-base font-medium">{address.displayName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccess;

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-4 bg-[#262626] border-l-4 border-green-500 rounded-lg p-4 mb-4 last:mb-0 shadow-md hover:translate-x-1 transition-all">
    <div className="flex-1">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-white text-base font-medium">{value}</p>
    </div>
  </div>
);
