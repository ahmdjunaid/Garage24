import React from "react";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import DarkModal from "@/components/layouts/DarkModal";
import { Phone } from "lucide-react";

interface AppointmentDetailsProps {
  appointment: PopulatedAppointmentData;
  isOpen: boolean;
  onClose: () => void;
  isUserView: boolean;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsProps> = ({
  appointment,
  isOpen,
  onClose,
  isUserView
}) => {
  const {
    status,
    appointmentDate,
    startTime,
    endTime,
    totalDuration,
    paymentStatus,
    services,
    vehicle,
    userData,
    garageId,
  } = appointment;

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 text-[#ddd]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333] pb-3">
          <h2 className="text-lg font-semibold">Appointment Details</h2>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-600 text-white capitalize">
            {status}
          </span>
        </div>

        {/* Appointment Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Detail
            label="Date"
            value={new Date(appointmentDate).toDateString()}
          />
          <Detail label="Time" value={`${startTime} - ${endTime}`} />
          <Detail label="Duration" value={`${totalDuration} mins`} />
          <Detail
            label="Payment"
            value={
              appointment.status === "cancelled"
                ? "Cancelled"
                : (paymentStatus ?? "Not Available")
            }
          />
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-[#aaa]">Services</h3>
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service.serviceId}
                className="flex justify-between bg-[#222] px-4 py-2 rounded-lg text-sm"
              >
                <span>{service.name}</span>
                <span className="text-[#aaa]">₹{service.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vehicle */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-[#aaa]">Vehicle</h3>
          <div className="bg-[#222] p-4 rounded-lg text-sm space-y-1">
            <p>
              {vehicle.make.name} {vehicle.model.name}
            </p>
            <p className="text-[#aaa]">
              {vehicle.licensePlate} · {vehicle.registrationYear}
            </p>
          </div>
        </div>

        {/* Garage */}
        {isUserView && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-[#aaa]">Garage</h3>
            <div className="bg-[#222] p-4 rounded-lg text-sm space-y-1">
              <p className="font-medium">{garageId.name}</p>
              <p className="text-[#aaa]">{garageId.address.displayName}</p>
              <p className="flex items-center gap-2 text-[#aaa]">
                <Phone size={16} />
                <span>{garageId.mobileNumber}</span>
              </p>
            </div>
          </div>
        )}

        {/* Customer */}
        {userData && !isUserView && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-[#aaa]">Customer</h3>
            <div className="bg-[#222] p-4 rounded-lg text-sm space-y-1">
              <p>{userData.name}</p>
              <p className="text-[#aaa]">{userData.email}</p>
              <p className="flex items-center gap-2 text-[#aaa]">
                <Phone size={16} />
                <span>{userData.mobileNumber}</span>
              </p>{" "}
            </div>
          </div>
        )}
        
      </div>
    </DarkModal>
  );
};

export default AppointmentDetailsModal;

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[#888] text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
