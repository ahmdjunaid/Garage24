import AppointmentCard from "@/components/cards/AppointmentCard";
import {
  cancelAppointmentApi,
  getAllAppointmentByUserIdApi,
} from "@/services/userServices";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { useCallback, useEffect, useState } from "react";
import Pagination from "../../admin/Pagination";
import Spinner from "@/components/elements/Spinner";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useNavigate } from "react-router-dom";

const MyAppointmentsSection = () => {
  const [appointments, setAppointments] = useState<PopulatedAppointmentData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tab, setTab] = useState<"current" | "previous">("current");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [idForCancel, setIdForCancel] = useState<string>("");

  const appointmentsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchAppointments = useCallback(
    async (page: number, activeTab: "current" | "previous") => {
      try {
        setLoading(true);
        const response = await getAllAppointmentByUserIdApi(
          page,
          appointmentsPerPage,
          activeTab,
        );
        setAppointments(response.appointments);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    },
    [appointmentsPerPage],
  );

  useEffect(() => {
    fetchAppointments(currentPage, tab);
  }, [currentPage, tab, fetchAppointments]);

  const handleCancel = async () => {
    if (!idForCancel || isCancelling) return;

    const page = currentPage;
    const activeTab = tab;

    try {
      setIsCancelling(true);
      await cancelAppointmentApi(idForCancel);
      await fetchAppointments(page, activeTab);
      successToast("Appointment cancelled.");
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setIsCancelling(false);
      setIdForCancel("");
    }
  };

  const handleReschedule = useCallback(
    (id: string) => {
      navigate(`/appointment/${id}/reschedule`);
    },
    [navigate],
  );

  const handleTabChange = (nextTab: "current" | "previous") => {
    if (nextTab === tab) return;
    setCurrentPage(1);
    setTab(nextTab);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-6">
      <div className="max-w-5xl mx-auto relative">
        <div className="flex gap-3 mb-10">
          {(["current", "previous"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-7 py-3 rounded-lg font-semibold text-sm transition-colors ${
                tab === t
                  ? "bg-[#ef4444] text-white"
                  : "bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white border border-[#3a3a3a]"
              }`}
            >
              {t === "current"
                ? "Current Appointments"
                : "Previous Appointments"}
            </button>
          ))}
        </div>

        {/* Appointment Cards */}
        <AppointmentCard
          appointments={appointments}
          handleCancel={(id) => setIdForCancel(id)}
          handleReschedule={handleReschedule}
          handleViewDetails={(id) => navigate(`/appointment/${id}`)}
        />

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#666] text-lg font-semibold mb-2">
              No appointments found
            </div>
            <p className="text-[#555] text-sm">
              {tab === "current"
                ? "You don't have any current appointments"
                : "You don't have any previous appointments"}
            </p>
          </div>
        )}
      </div>

      <Spinner loading={loading && appointments.length === 0} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <ConfirmModal
        isOpen={!!idForCancel}
        message="Are you sure you want to cancel this appointment?"
        onClose={() => setIdForCancel("")}
        onConfirm={handleCancel}
        onCancel={() => setIdForCancel("")}
      />
    </div>
  );
};

export default MyAppointmentsSection;
