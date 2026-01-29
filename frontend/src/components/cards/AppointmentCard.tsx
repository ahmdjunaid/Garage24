import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import React from "react";

interface CardProps {
  appointments: PopulatedAppointmentData[];
  handleCancel: (id: string) => void;
  handleReschedule: (id: string) => void;
  handleViewDetails: (data: PopulatedAppointmentData) => void;
}

const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];

const AppointmentCard: React.FC<CardProps> = ({
  appointments,
  handleCancel,
  handleReschedule,
  handleViewDetails,
}) => {
  return (
    <div>
      <div className="space-y-5">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-7 transition-colors hover:border-[#ef4444]/40"
          >
            <div className="flex items-center justify-between gap-6">
              {/* Left */}
              <div className="flex items-center gap-5">
                <div className="w-[70px] h-[70px] rounded-xl flex items-center justify-center border border-[#ef4444]/30 bg-[#2a2a2a]">
                  <svg
                    className="w-9 h-9 text-[#ef4444]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <rect x="4" y="11" width="16" height="8" rx="1.5" />
                    <circle cx="7" cy="16" r="1.5" />
                    <circle cx="17" cy="16" r="1.5" />
                    <path
                      d="M4 11V9.5C4 8.67 4.67 8 5.5 8h13C19.33 8 20 8.67 20 9.5V11"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-white text-lg font-semibold">
                    {appointment.vehicle.make.name +
                      appointment.vehicle.model.name}
                    <span className="text-[#888] font-normal">
                      ({appointment.vehicle.licensePlate})
                    </span>
                  </h3>
                  <p className="text-[#999] text-sm">
                    {appointment.serviceIds
                      .map((service) => service.name)
                      .join(", ")}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-gray-600 text-white capitalize">
                    {appointment.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {ACTIVE_STATUSES.includes(appointment.status) && (
                  <>
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ddd] rounded-lg text-sm border border-[#3a3a3a]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReschedule(appointment._id)}
                      className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ddd] rounded-lg text-sm border border-[#3a3a3a]"
                    >
                      Reschedule
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewDetails(appointment)}
                  className="px-5 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentCard;
