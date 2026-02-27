import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { fetchApptsByGarageIdForChatApi } from "../services/chatServices";
import { errorToast } from "@/utils/notificationAudio";
import type { IChatAppointment } from "@/types/ChatTypes";
import { AppointmentRow } from "./ChatAppointmentRow";
import { ChatPanel } from "./ChatPanel";

export default function ChatGarage() {
  const [appointments, setAppointments] = useState<IChatAppointment[]>([]);
  const [selected, setSelected] = useState<IChatAppointment | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [loadingList, setLoadingList] = useState<boolean>(true);

  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchAppointments = async (garageId: string) => {
      try {
        const response = await fetchApptsByGarageIdForChatApi(garageId);
        setAppointments(response);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoadingList(false);
      }
    };

    fetchAppointments(currentUserId);
  }, [currentUserId]);

  const selectAppt = (appt: IChatAppointment) => {
    setSelected(appt);
    setMobileView("chat");
  };

  return (
    <div className="h-full flex overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">

      {/* ── Sidebar ── */}
      <aside className={`
        flex flex-col bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 shadow-2xl backdrop-blur-sm
        w-full md:w-80 lg:w-[340px] flex-shrink-0
        ${mobileView === "chat" ? "hidden md:flex" : "flex"}
      `}>
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-6 h-6 rounded-full border-2 border-[#E5173F] border-t-transparent animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm gap-2 px-4 text-center">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No active appointments
            </div>
          ) : (
            appointments.map(appt => (
              <AppointmentRow
                key={appt._id}
                appt={appt}
                selected={selected?._id === appt._id}
                onClick={() => selectAppt(appt)}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Chat Area ── */}
      <main className={`
        flex-1 flex flex-col min-w-0
        ${mobileView === "list" ? "hidden md:flex" : "flex"}
      `}>
        {selected ? (
          <ChatPanel
            appt={selected}
            currentUserId={currentUserId!}
            onBack={() => setMobileView("list")}
            role="garage"
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}


function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl flex items-center justify-center">
        <svg className="w-9 h-9 text-[#E5173F] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-200 text-base">Select a conversation</p>
        <p className="text-sm text-gray-500 mt-1">Pending &amp; in-progress appointments appear here</p>
      </div>
    </div>
  );
}