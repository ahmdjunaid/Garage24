import DarkModal from "@/components/modal/DarkModal";
import {
  ROLE_AVATAR_COLOR,
  ROLE_BUBBLE,
  ROLE_LABEL,
  STATUS_CONFIG,
} from "@/features/chat/constants/constantsDatas";
import {
  formatTime,
  getSenderId,
  groupByDate,
  initials,
  messageIsOwn,
  vehicleDisplayName,
} from "@/features/chat/handlers/handler";
import { fetchMessagesByAppIdApi } from "@/features/chat/services/chatServices";
import { socket } from "@/lib/socket";
import type { IChatAppointment, IChatMessage } from "@/types/ChatTypes";
import { errorToast } from "@/utils/notificationAudio";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchApptForChatByAppIdApi } from "../services/appointmentServices";
import { EmptyState } from "@/features/chat/components/ChatMechanic";

interface ChatModalProps {
  currentUserId: string;
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  currentUserId,
  appointmentId,
  isOpen,
  onClose,
}) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [appt, setAppt] = useState<IChatAppointment | null>(null);

  useEffect(() => {
    const fetchAppointment = async (appointmentId: string) => {
      try {
        setLoading(true);
        const response = await fetchApptForChatByAppIdApi(appointmentId);
        setAppt(response);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment(appointmentId);
  }, [appointmentId]);

  useEffect(() => {
    setMessages([]);
    setLoading(true);

    const fetchMessages = async (appointmentId: string) => {
      try {
        const response = await fetchMessagesByAppIdApi(appointmentId);
        setMessages(response);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages(appointmentId);
  }, [appointmentId]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("joinAppointmentRoom", appointmentId);

    const handleReceiveMessage = (msg: IChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.emit("leaveRoom", appointmentId);
    };
  }, [appointmentId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    socket.emit("sendMessage", {
      appointmentId: appointmentId,
      message: trimmed,
      senderId: currentUserId,
      senderRole: "customer",
    });

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, appointmentId, currentUserId]);

  if (!appt) {
    return (
      <DarkModal isOpen={isOpen} onClose={() => onClose()}>
        <EmptyState />
      </DarkModal>
    );
  }

  const groups = groupByDate(messages);
  const name = vehicleDisplayName(appt);
  const st = STATUS_CONFIG[appt.status];
  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="flex flex-col h-full">
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-[#E5173F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            {initials(name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white truncate">
                {name}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 tracking-wider">
              {appt.vehicle?.licensePlate}
            </span>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 bg-gradient-to-br from-gray-950 via-gray-900 to-black dark-modal-scroll rounded-xl">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-6 h-6 rounded-full border-2 border-[#E5173F] border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-500 text-sm">
              <svg
                className="w-8 h-8 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              No messages yet
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                {/* Date divider */}
                <div className="flex justify-center my-4">
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full shadow-sm">
                    {group.label}
                  </span>
                </div>

                {group.messages.map((msg, i) => {
                  const prevSenderId = getSenderId(
                    group.messages[i - 1]?.senderId,
                  );
                  const sameSender = prevSenderId === getSenderId(msg.senderId);
                  const isOwn = messageIsOwn(msg, currentUserId);
                  return (
                    <div
                      key={msg._id || `${getSenderId(msg.senderId)}-${i}`}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"} ${sameSender ? "mt-0.5" : "mt-3"}`}
                    >
                      {!isOwn && (
                        <div className="w-7 h-7 flex-shrink-0 mr-2 self-end mb-5">
                          {!sameSender ? (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow"
                              style={{
                                backgroundColor:
                                  ROLE_AVATAR_COLOR[msg.senderRole],
                              }}
                            >
                              {msg.senderRole[0].toUpperCase()}
                            </div>
                          ) : (
                            <div className="w-7 h-7" />
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[72%] sm:max-w-[58%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                      >
                        {!sameSender && (
                          <span
                            className={`text-[11px] font-semibold mb-1 px-1 ${
                              isOwn
                                ? "text-[#E5173F]"
                                : ROLE_LABEL[msg.senderRole].color
                            }`}
                          >
                            {isOwn
                              ? "You"
                              : `${ROLE_LABEL[msg.senderRole].text}`}
                          </span>
                        )}

                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                            isOwn
                              ? "bg-[#E5173F] text-white rounded-br-md"
                              : `${ROLE_BUBBLE[msg.senderRole]} rounded-bl-md`
                          }`}
                        >
                          {msg.message}
                        </div>

                        <span className="text-[10px] text-gray-600 mt-1 px-1">
                          {formatTime(msg.createdAt || new Date())}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 px-4 py-3 shadow-lg rounded-xl">
          <div
            className={`flex items-end gap-3 bg-gradient-to-br from-gray-950 to-black border rounded-xl px-4 py-2.5 transition-colors duration-200 ${
              input ? "border-[#E5173F]" : "border-gray-800"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 resize-none outline-none leading-relaxed min-h-[22px] max-h-[120px]"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                input.trim()
                  ? "bg-[#E5173F] text-white hover:bg-[#c0122f] active:scale-95 shadow-md"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
              aria-label="Send"
            >
              <svg
                className="w-4 h-4 translate-x-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-1.5 text-center select-none">
            Shift + Enter for new line
          </p>
        </div>
      </div>
    </DarkModal>
  );
};

export default ChatModal;
