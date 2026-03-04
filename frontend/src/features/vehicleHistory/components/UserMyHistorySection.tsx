import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import { errorToast } from "@/utils/notificationAudio";
import { useCallback, useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppointmentHistoryCard from "./HistoryCard";
import { fetchAptsByVehicleNumForUserApi } from "../services/historyServices";

const MyAppointmentsHistorySection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleNum = searchParams.get("licence_plate") || "";

  const [appointments, setAppointments] = useState<PopulatedAppointmentData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(vehicleNum);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const appointmentsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery(vehicleNum);
  }, [vehicleNum]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchAppointments = useCallback(
    async (page: number, query: string) => {
      try {
        setLoading(true);
        const response = await fetchAptsByVehicleNumForUserApi(
          page,
          appointmentsPerPage,
          query,
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
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    fetchAppointments(currentPage, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchAppointments(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchQuery(value);

    setSearchParams({
      licence_plate: value,
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-6">
      <div className="max-w-5xl mx-auto relative">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-sm">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Registration Number..."
              className="w-full bg-[#2a2a2a] border border-[#333] focus:border-red-500 focus:outline-none text-white placeholder-gray-500 text-sm rounded-lg pl-9 pr-9 py-2.5 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-[#555] text-xs mt-2">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "Enter a vehicle registration number to filter appointments."}
          </p>
        </div>

        {/* Appointment Cards */}
        <AppointmentHistoryCard
          appointments={appointments}
          handleViewDetails={(id) => navigate(`/appointment/${id}`)}
        />

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#666] text-lg font-semibold mb-2">
              {searchQuery
                ? `No appointment history found for vehicle "${searchQuery}".`
                : "No appointment history available."}
            </div>
          </div>
        )}
      </div>

      <Spinner loading={loading && appointments.length === 0} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default MyAppointmentsHistorySection;
