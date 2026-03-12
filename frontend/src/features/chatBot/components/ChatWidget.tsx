import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { MessageCircle, X, Minus, Send, Trash2 } from "lucide-react";
import { chatBotApi } from "../services/chatBotServices";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const nodeRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async (text: string): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, id: Date.now() },
    ]);
    setLoading(true);

    try {
      const response: string = await chatBotApi(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, id: Date.now() },
      ]);
    } catch (error) {
        if(error instanceof Error)
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleToggle = (): void => {
    setOpen((prev) => !prev);
    setMinimized(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="body">
          <div
            ref={nodeRef}
            className="fixed bottom-24 right-6 z-40 w-80 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden"
            style={{ height: minimized ? "auto" : 460 }}
          >
            {/* Header */}
            <div className="drag-handle bg-red-500 px-4 py-3 flex items-center gap-3 cursor-move select-none">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Assistant</p>
                <p className="text-red-200 text-xs">
                  {loading ? "Typing..." : "Online"}
                </p>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-red-200 hover:text-white p-1 rounded"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setMinimized((prev) => !prev)}
                className="text-red-200 hover:text-white p-1 rounded"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-red-200 hover:text-white p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-neutral-500 text-sm text-center pt-6">
                      How can I help you? 👋
                    </p>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-red-500 text-white rounded-br-sm"
                            : "bg-neutral-800 text-neutral-100 rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-800 px-3 py-2 rounded-2xl rounded-bl-sm">
                        <span className="flex gap-1 items-center py-0.5">
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-xs text-red-400 text-center bg-red-500/10 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-neutral-800 bg-neutral-900 flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    disabled={loading}
                    className="flex-1 resize-none text-sm border border-neutral-700 rounded-xl px-3 py-2 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        </Draggable>
      )}
    </>
  );
}