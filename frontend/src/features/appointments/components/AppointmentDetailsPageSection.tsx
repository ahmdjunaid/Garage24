import React, { useEffect, useMemo, useState } from "react";
import { Phone, CheckCircle2, User, Calendar, Clock } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import type {
  IAppointmentEvents,
  PopulatedAppointmentData,
} from "@/types/AppointmentTypes";
import { SERVICE_STATUS_META } from "@/constants/appointmentServiceStatus";
import {
  getAppointmentDetails,
  makeServicePaymentApi,
} from "../services/appointmentServices";
import { errorToast } from "@/utils/notificationAudio";
import Spinner from "@/components/common/Spinner";
import { retriveTransactionApi } from "@/features/subscription/services/subscriptionService";
import type { IRetriveSessionData } from "@/types/CommonTypes";
import PaymentSuccessModal from "../modals/PaymentSuccessModal";

interface DetailPageProps {
  isUserView: boolean;
}

const AppointmentDetailsPageSection: React.FC<DetailPageProps> = ({
  isUserView,
}) => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [appointment, setAppointment] =
    useState<PopulatedAppointmentData | null>(null);
  const [paymentData, setPaymentData] = useState<IRetriveSessionData | null>(
    null,
  );

  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!sessionId) return;
      setLoading(true);
      try {
        const res = await retriveTransactionApi(sessionId);
        setPaymentData(res);
      } catch (error) {
        if (error instanceof Error)
          errorToast("Failed to fetch transaction details");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [sessionId]);

  useEffect(() => {
    if (!appointmentId) return;
    getAppointmentData(appointmentId);
  }, [appointmentId]);

  const getAppointmentData = async (appointmentId: string) => {
    if(!appointmentId) return
    try {
      const res = await getAppointmentDetails(appointmentId);
      setAppointment(res);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4444] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  const totalPrice = appointment.services.reduce(
    (sum, service) => sum + service.price,
    0,
  );
  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";

  const handlePayment = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await makeServicePaymentApi(appointmentId);
      console.log(response);
      if (response) window.location.href = response.url;
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date and time helper
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="text-center p-5">
        <h1 className="text-4xl font-bold">Appointment Details</h1>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Vehicle & Status Header */}
        <div className="bg-[#242424] rounded-xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Vehicle Icon Placeholder */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" className="text-gray-800" />
                  <path d="M12 6v6l4 2" className="text-gray-800" />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {appointment.vehicle.make.name}
                  <span className="text-gray-400 ms-2">
                    {appointment.vehicle.model.name}
                  </span>
                  <span className="text-gray-500 text-base ml-2">
                    ({appointment.vehicle.licensePlate})
                  </span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {appointment.services[0]?.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-md font-medium capitalize">
                    {appointment.status}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}{" "}
                    • {appointment.startTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isUserView && (
                <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Mechanic Notes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Info Card */}
        <div className="bg-[#242424] rounded-xl p-6 border border-[#2a2a2a]">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#ef4444]" />
            Appointment Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DetailItem
              label="Date"
              value={new Date(appointment.appointmentDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                },
              )}
            />
            <DetailItem
              label="Time Slot"
              value={`${appointment.startTime} - ${appointment.endTime}`}
            />
            <DetailItem
              label="Duration"
              value={`${appointment.totalDuration} mins`}
            />
            <DetailItem
              label="Payment"
              value={
                isCancelled
                  ? "Cancelled"
                  : (appointment.paymentStatus ?? "Pending")
              }
              valueClass={
                appointment.paymentStatus === "paid" ? "text-green-400" : ""
              }
            />
          </div>
        </div>

        {/* Activity Timeline - Only show if not cancelled and has events */}
        {!isCancelled &&
          appointment.events &&
          appointment.events.length > 0 && (
            <div className="bg-[#242424] rounded-xl p-6 border border-[#2a2a2a]">
              <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
                <Clock size={18} className="text-[#ef4444]" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                {appointment.events.map(
                  (event: IAppointmentEvents, index: number) => {
                    const isLast = index === appointment.events!.length - 1;
                    return (
                      <div className="flex gap-3">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500">
                            <CheckCircle2
                              size={14}
                              className="text-green-500"
                            />
                          </div>

                          {!isLast && (
                            <div className="w-[1px] h-full min-h-[36px] bg-[#2a2a2a] mt-1.5" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-1">
                          <p className="text-sm font-medium text-white mb-1.5 leading-snug">
                            {event.message}
                          </p>

                          <div className="flex items-center justify-between flex-wrap gap-1.5 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-gray-400">
                                <User size={10} />
                                <span>{event.actorName}</span>
                              </span>

                              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                                {event.actorRole}
                              </span>
                            </div>

                            <span className="text-gray-500 text-[10px]">
                              {formatDateTime(event.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

        {/* Services Card */}
        <div className="bg-[#242424] rounded-xl p-6 border border-[#2a2a2a]">
          <h3 className="text-base font-semibold mb-4">Services</h3>
          <div className="space-y-3">
            {appointment.services.map((service, index) => {
              const statusMeta =
                SERVICE_STATUS_META[
                  service.status as keyof typeof SERVICE_STATUS_META
                ];

              return (
                <div
                  key={service.serviceId}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center gap-3">
                    {/* Index */}
                    <span className="w-6 h-6 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs text-gray-400">
                      {index + 1}
                    </span>

                    {/* Service name */}
                    <span className="text-gray-300">{service.name}</span>

                    {/* Status indicator */}
                    <span className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${statusMeta.color}`}
                      />
                      <span className="text-gray-400">{statusMeta.label}</span>
                    </span>
                  </div>

                  {/* Price */}
                  <span className="font-semibold text-white">
                    ₹{service.price}
                  </span>
                </div>
              );
            })}
            <div className="pt-4 border-t border-[#2a2a2a] flex justify-between items-center">
              <span className="font-semibold text-gray-400">Total Amount</span>
              <span className="text-xl font-bold text-white">
                ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-[#242424] rounded-xl p-6 border border-[#2a2a2a]">
          <h3 className="text-base font-semibold mb-4">Vehicle Details</h3>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">
              {appointment.vehicle.make.name} {appointment.vehicle.model.name}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1.5 bg-[#2a2a2a] rounded-lg font-mono text-white">
                {appointment.vehicle.licensePlate}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                Year: {appointment.vehicle.registrationYear}
              </span>
            </div>
          </div>
        </div>

        {/* Garage Card - User View */}
        {isUserView && appointment.garageId && (
          <div className="bg-[#242424] rounded-xl p-6 border border-[#2a2a2a]">
            <h3 className="text-base font-semibold mb-4">Garage Information</h3>
            <div className="space-y-2">
              <p className="font-semibold text-lg text-white">
                {appointment.garageId.name}
              </p>
              <p className="text-gray-400 text-sm">
                {appointment.garageId.address.displayName}
              </p>
              <a
                href={`tel:${appointment.garageId.mobileNumber}`}
                className="flex items-center gap-2 text-[#ef4444] hover:text-[#dc2626] transition-colors w-fit text-sm"
              >
                <Phone size={16} />
                <span>{appointment.garageId.mobileNumber}</span>
              </a>
            </div>
          </div>
        )}

        {/* Customer Card - Garage View */}
        {appointment.userData && !isUserView && (
          <div className="bg-[#242424] rounded-xl p-6 border border-[#2a2a2a]">
            <h3 className="text-base font-semibold mb-4">
              Customer Information
            </h3>
            <div className="space-y-2">
              <p className="font-semibold text-lg text-white">
                {appointment.userData.name}
              </p>
              <p className="text-gray-400 text-sm">
                {appointment.userData.email}
              </p>
              <a
                href={`tel:${appointment.userData.mobileNumber}`}
                className="flex items-center gap-2 text-[#ef4444] hover:text-[#dc2626] transition-colors w-fit text-sm"
              >
                <Phone size={16} />
                <span>{appointment.userData.mobileNumber}</span>
              </a>
            </div>

            {/* Mechanic Assignment */}
            <div className="mt-5 pt-5 border-t border-[#2a2a2a]">
              <h4 className="text-sm font-semibold mb-2 text-gray-400">
                Assigned Mechanic
              </h4>
              {appointment.mechanicId ? (
                <div className="flex items-center gap-2 text-green-400">
                  <User size={16} />
                  <span className="font-medium">
                    {appointment.mechanicId.name}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Mechanic not assigned yet
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment Button - Show only when completed and payment is pending */}
        {isUserView && isCompleted && appointment.paymentStatus !== "paid" && (
          <div className="pt-2 pb-4">
            <button
              onClick={() => handlePayment(appointment._id)}
              className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold py-3.5 rounded-lg transition-colors"
            >
              Proceed to Payment - ₹{totalPrice}
            </button>
          </div>
        )}
      </div>
      <PaymentSuccessModal
        paymentData={paymentData}
        isOpen={!!paymentData}
        onClose={() => {
          setPaymentData(null);
        }}
      />
      <Spinner loading={loading} />
    </div>
  );
};

export default AppointmentDetailsPageSection;

const DetailItem = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div>
    <p className="text-gray-500 text-xs mb-1.5 uppercase tracking-wide">
      {label}
    </p>
    <p className={`font-medium ${valueClass || "text-white"}`}>{value}</p>
  </div>
);
