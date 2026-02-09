import React, { useEffect, useState } from "react";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import DarkModal from "@/components/layouts/DarkModal";
import { Phone } from "lucide-react";
import type { AssignableMechanic } from "@/types/MechanicTypes";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { assignMechanicApi, getAssignableMechanics } from "@/services/garageServices";
import { updateServiceStatusApi } from "@/services/mechanicServices";

interface AppointmentDetailsProps {
  appointment: PopulatedAppointmentData;
  isOpen: boolean;
  onClose: () => void;
  role: "GARAGE_OWNER" | "MECHANIC";
  onUpdate: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsProps> = ({
  appointment,
  isOpen,
  onClose,
  role,
  onUpdate
}) => {
  const {
    _id,
    status,
    appointmentDate,
    startTime,
    endTime,
    totalDuration,
    paymentStatus,
    services,
    vehicle,
    userData,
    garageUID
  } = appointment;

  const [selectedMechanicId, setSelectedMechanicId] = useState<string>(
    appointment.mechanicId?._id || "",
  );
  const [assigning, setAssigning] = useState(false);
  const [mechanics, setMechanics] = useState<AssignableMechanic[] | []>([]);

  useEffect(() => {
    if(role === "MECHANIC") return;
    const fetchMechanics = async (garageId: string) => {
      try {
        const res = await getAssignableMechanics(garageId);
        setMechanics(res);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      }
    };

    fetchMechanics(garageUID);
  }, [garageUID, role]);

  const handleAssignMechanic = async () => {
    if (!selectedMechanicId) return;

    try {
      setAssigning(true);
      await assignMechanicApi(_id, selectedMechanicId);
      onUpdate()
      successToast("Mechanic assigned")
    } catch(error){
      if(error instanceof Error)
        errorToast(error.message)
    }finally {
      setAssigning(false);
    }
  };

  const handleServiceStatusUpdate = async (
    serviceId: string,
    status: "started" | "completed" | "skipped",
  ) => {
    try {
      await updateServiceStatusApi(_id, serviceId, status);
      onUpdate()
      successToast("Status Updated")
    } catch (error) {
      if(error instanceof Error)
        errorToast(error.message)
    }
  };

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
              status === "cancelled"
                ? "Cancelled"
                : (paymentStatus ?? "Not Available")
            }
          />
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-[#aaa]">Services</h3>
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.serviceId}
                className="flex justify-between items-center bg-[#222] px-4 py-2 rounded-lg"
              >
                <div>
                  <p className="text-sm">{service.name}</p>
                  <p className="text-xs text-[#888] capitalize">
                    {service.status}
                  </p>
                </div>

                {role === "MECHANIC" && (
                  <div className="flex gap-2">
                    {service.status === "pending" && (
                      <button
                        onClick={() =>
                          handleServiceStatusUpdate(
                            service.serviceId,
                            "started",
                          )
                        }
                        className="px-3 py-1 text-xs bg-blue-600 rounded"
                      >
                        Start
                      </button>
                    )}

                    {service.status === "started" && (
                      <>
                        <button
                          onClick={() =>
                            handleServiceStatusUpdate(
                              service.serviceId,
                              "completed",
                            )
                          }
                          className="px-3 py-1 text-xs bg-green-600 rounded"
                        >
                          Complete
                        </button>

                        <button
                          onClick={() =>
                            handleServiceStatusUpdate(
                              service.serviceId,
                              "skipped",
                            )
                          }
                          className="px-3 py-1 text-xs bg-red-600 rounded"
                        >
                          Skip
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* appointmentAssignment */}
        {role === "GARAGE_OWNER" && (
          <Section title="Assign Mechanic">
            <select
              value={selectedMechanicId}
              onChange={(e) => setSelectedMechanicId(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select mechanic</option>
              {mechanics.map((m) => (
                <option key={m._id} value={m._id} selected={m._id===selectedMechanicId}>
                  {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignMechanic}
              disabled={
                !selectedMechanicId ||
                selectedMechanicId === appointment.mechanicId?._id ||
                assigning
              }
              className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-md text-sm"
            >
              {appointment.mechanicId ? "Reassign Mechanic" : "Assign Mechanic"}
            </button>

            {appointment.mechanicId && (
              <p className="text-xs text-[#888] mt-1">
                Current mechanic: {appointment.mechanicId?.name}
              </p>
            )}
          </Section>
        )}

         {/* Vehicle */}
        <Section title="Vehicle">
          <p>
            {vehicle.make.name} {vehicle.model.name}
          </p>
          <p className="text-[#aaa]">
            {vehicle.licensePlate} · {vehicle.registrationYear}
          </p>
        </Section>

        {/* Customer (Garage / Mechanic) */}
        {userData && (
          <Section title="Customer">
            <p>{userData.name}</p>
            <p className="text-[#aaa]">{userData.email}</p>
            <p className="flex items-center gap-2 text-[#aaa]">
              <Phone size={14} />
              {userData.mobileNumber}
            </p>
          </Section>
        )}
      </div>
    </DarkModal>
  );
};

export default AppointmentDetailsModal;


const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-sm font-semibold mb-2 text-[#aaa]">{title}</h3>
    <div className="bg-[#222] p-4 rounded-lg text-sm space-y-1">{children}</div>
  </div>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[#888] text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
