import type { DefaultToastOptions } from "react-hot-toast";

export const toastStyles: DefaultToastOptions = {
  style: {
    fontSize: "14px",
    padding: "16px 24px",
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
    fontWeight: 400,
    maxWidth: "360px",
    lineHeight: "1.5",
    wordBreak: "break-word",
    whiteSpace: "normal",
    textAlign: "left",
  },
  success: {
    style: { background: "#4caf50", color: "#fff" },
  },
  error: {
    style: { background: "#f44336", color: "#fff" },
  },
};
