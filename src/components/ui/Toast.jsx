import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function Toast({ type = "success", message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-green-50",
      color: "text-green-700",
      border: "border-green-200",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-50",
      color: "text-red-700",
      border: "border-red-200",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50",
      color: "text-blue-700",
      border: "border-blue-200",
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${config.bg} ${config.border} shadow-sm max-w-sm`}
      >
        <Icon className={`w-5 h-5 ${config.color} shrink-0 mt-0.5`} />
        <p className={`text-sm ${config.color} flex-1`}>{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
