import { useContext } from "react";
import ToastContext from "../context/ToastContext";

export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus digunakan di dalam ToastProvider");

  return {
    success: (message) => ctx.push({ type: "success", message }),
    error: (message) => ctx.push({ type: "error", message }),
    info: (message) => ctx.push({ type: "info", message }),
  };
}
