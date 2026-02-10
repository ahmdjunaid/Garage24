import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, AlertTriangle, Building, Car, Settings } from "lucide-react";

import Spinner from "@/components/common/Spinner";
import { getNext7Days } from "@/utils/getNext7Days";
import { errorToast, successToast } from "@/utils/notificationAudio";

import type { ISlots } from "@/types/SlotTypes";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import type { timeSlot } from "@/features/appointments/components/AppointmentForm";
import {
  getAppointmentForRescheduleApi,
  getAvailableSlotsByGarageId,
  rescheduleAppointmentApi,
} from "../services/appointmentServices";

const RescheduleAppointmentForm = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] =
    useState<PopulatedAppointmentData | null>(null);

  const [garageUserId, setGarageUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<ISlots[]>([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<timeSlot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const res = await getAppointmentForRescheduleApi(appointmentId);

        if (!["pending", "confirmed"].includes(res.status)) {
          errorToast(
            "Appointment is not available for rescheduling at this stage.",
          );
          navigate(-1);
          return;
        }

        setAppointment(res);
        setGarageUserId(res.garageUID);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, navigate]);

  useEffect(() => {
    if (!selectedDate || !garageUserId) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        const res = await getAvailableSlotsByGarageId(
          garageUserId,
          selectedDate,
        );
        setTimeSlots(res);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, garageUserId]);

  const getRequiredSlots = (
    startIndex: number,
    totalDuration: number,
    slots: ISlots[],
  ): ISlots[] => {
    const required: ISlots[] = [];
    let remaining = totalDuration;

    for (let i = startIndex; i < slots.length && remaining > 0; i++) {
      const slot = slots[i];

      if (slot.capacity - slot.bookedCount <= 0) break;

      required.push(slot);
      remaining -= slot.durationInMinutes || 30;
    }

    return remaining <= 0 ? required : [];
  };

  const handleTimeSlotClick = (slot: ISlots, index: number) => {
    if (!appointment) return;

    const requiredSlots = getRequiredSlots(
      index,
      appointment.totalDuration,
      timeSlots,
    );

    if (requiredSlots.length === 0) {
      errorToast(
        "Not enough consecutive time slots available for this service duration.",
      );
      return;
    }

    setSelectedSlotIds(requiredSlots.map((s) => s._id));
    setSelectedTime({
      slotId: slot._id,
      startTime: slot.startTime,
    });
  };

  const handleReschedule = async () => {
    if (!appointmentId || !selectedDate || selectedSlotIds.length === 0) {
      errorToast("Please select a new date and time");
      return;
    }

    try {
      setLoading(true);
      await rescheduleAppointmentApi(appointmentId, {
        date: selectedDate,
        releasableSlotIds: appointment?.slotIds,
        slotIds: selectedSlotIds,
        startTime: selectedTime?.startTime,
        duration: appointment?.totalDuration,
      });

      successToast("Appointment rescheduled successfully");
      navigate("/my-appointments");
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1b1b] to-[#111] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Reschedule Appointment</h1>
          <p className="text-gray-400">
            Review your appointment and choose a new time
          </p>
        </div>

        {/* Appointment Summary */}
        {appointment && (
          <section className="mb-10">
            <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-lg border border-[#333]">
              <h2 className="text-xl font-semibold mb-5">
                Appointment Summary
              </h2>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <Building size={16} />
                  <span className="font-medium text-white">
                    {appointment.garageId.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Car size={16} />
                  <span>
                    {appointment.vehicle.make.name}{" "}
                    {appointment.vehicle.model.name} ·{" "}
                    {appointment.vehicle.licensePlate}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Settings size={16} />
                  <div className="flex flex-wrap gap-2">
                    {appointment.services.map((service) => (
                      <span
                        key={service.serviceId}
                        className="px-3 py-1 rounded-full text-xs bg-[#1f1f1f]"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} />
                  <span>
                    {new Date(appointment.appointmentDate).toDateString()} ·{" "}
                    <span className="font-medium">{appointment.startTime}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Date Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Pick a New Date
          </h2>

          <div className="flex gap-4 justify-center overflow-x-auto">
            {getNext7Days().map((day) => (
              <button
                key={day.date}
                onClick={() => {
                  setSelectedDate(day.date);
                  setSelectedSlotIds([]);
                  setSelectedTime(null);
                }}
                className={`w-24 p-4 rounded-2xl transition-all ${
                  selectedDate === day.date
                    ? "bg-red-500 shadow-2xl"
                    : "bg-[#2a2a2a]"
                }`}
              >
                <div className="text-sm opacity-80">{day.day}</div>
                <div className="text-3xl font-bold">{day.dayNum}</div>
                <div className="text-sm opacity-80">{day.month}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Time Slots */}
        {selectedDate && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Choose a New Time
            </h2>

            {timeSlots.length === 0 && !loading && (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 text-center">
                <AlertTriangle className="inline-block mr-2" />
                No slots available for this date
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {timeSlots.map((slot, index) => {
                const available = slot.capacity - slot.bookedCount > 0;
                const isSelected = selectedSlotIds.includes(slot._id);

                return (
                  <button
                    key={slot._id}
                    onClick={() => handleTimeSlotClick(slot, index)}
                    disabled={!available}
                    className={`p-4 rounded-xl font-semibold transition-all
                      ${
                        isSelected
                          ? "bg-red-500 ring-2 ring-red-300"
                          : available
                            ? "bg-[#2a2a2a] hover:bg-[#353535]"
                            : "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
                      }`}
                  >
                    <Clock size={14} className="mx-auto mb-2" />
                    <div className="text-sm">{slot.startTime}</div>
                    {slot.capacity - slot.bookedCount <= 0 && (
                      <div className="text-xs text-gray-400 mt-1">Full</div>
                    )}
                    {slot.capacity - slot.bookedCount > 0 && (
                      <div className="text-xs text-yellow-400 mt-1">
                        {slot.capacity - slot.bookedCount} left
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Submit */}
        <button
          onClick={handleReschedule}
          disabled={!selectedDate || selectedSlotIds.length === 0}
          className="w-full py-5 bg-gray-700 rounded-xl font-bold text-xl hover:bg-gray-600 disabled:opacity-50"
        >
          Confirm Reschedule
        </button>
      </div>

      <Spinner loading={loading} />
    </div>
  );
};

export default RescheduleAppointmentForm;
