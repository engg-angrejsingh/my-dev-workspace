import { toast } from "react-toastify";

// 🎨 Base style (shared)
const baseStyle = {
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "14px",
  fontWeight: "500",
};

// ✅ Success
export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      ...baseStyle,
      background: "rgba(15, 23, 42, 0.85)", // slate-900
      border: "1px solid rgba(34,197,94,0.25)",
      boxShadow: "0 0 25px rgba(34,197,94,0.15)",
      color: "#bbf7d0",
    },
  });
};

// ❌ Error
export const showError = (message) => {
  toast.error(message, {
    style: {
      ...baseStyle,
      background: "rgba(15, 23, 42, 0.9)",
      border: "1px solid rgba(244,63,94,0.25)",
      boxShadow: "0 0 25px rgba(244,63,94,0.15)",
      color: "#fecdd3",
    },
  });
};

// ⚠️ Info
export const showInfo = (message) => {
  toast.info(message, {
    style: {
      ...baseStyle,
      background: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(59,130,246,0.25)",
      boxShadow: "0 0 25px rgba(59,130,246,0.15)",
      color: "#bfdbfe",
    },
  });
};