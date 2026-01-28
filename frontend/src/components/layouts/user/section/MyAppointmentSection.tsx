import AppointmentCard from "@/components/cards/AppointmentCard";
import { getAllAppointmentByUserIdApi } from "@/services/userRouter";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import { errorToast } from "@/utils/notificationAudio";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "../../admin/Pagination";
import Spinner from "@/components/elements/Spinner";

const MyAppointmentsSection = () => {
  const [appointments, setAppointments] = useState<PopulatedAppointmentData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const appointmentsPerPage = 6;

  const fetchAppointments = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        setLoading(true);
        const response = await getAllAppointmentByUserIdApi(
          currentPage,
          appointmentsPerPage,
          searchQuery,
        );
        setAppointments(response.appointments);
        console.log(response.appointments);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    },
    [appointmentsPerPage],
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchAppointments(page, query);
      }, 300),
    [fetchAppointments],
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchAppointments(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchAppointments, debouncedFetch]);

  const handleCancel = (id: string): void => {};

  const handleReschedule = (id: string): void => {};

  const handleViewDetails = (id: string): void => {};

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Tabs */}
        <div className="flex gap-3 mb-10">
          {["current", "previous"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSearchQuery(tab as "current" | "previous")}
              className={`px-7 py-3 rounded-full font-semibold text-sm transition-colors ${
                searchQuery === tab
                  ? "bg-[#ef4444] text-white"
                  : "bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white border border-[#3a3a3a]"
              }`}
            >
              {tab === "current" ? "Current Appointments" : "Previous"}
            </button>
          ))}
        </div>

        {/* Appointment Cards */}
        <AppointmentCard
          appointments={appointments}
          handleCancel={(id) => handleCancel(id)}
          handleReschedule={(id) => handleReschedule(id)}
          handleViewDetails={(id) => handleViewDetails(id)}
        />

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#666] text-lg font-semibold mb-2">
              No appointments found
            </div>
            <p className="text-[#555] text-sm">
              {searchQuery === "current"
                ? "You don't have any current appointments"
                : "You don't have any previous appointments"}
            </p>
          </div>
        )}
      </div>

      <Spinner loading={loading} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default MyAppointmentsSection;
