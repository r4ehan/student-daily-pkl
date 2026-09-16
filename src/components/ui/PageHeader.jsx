import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  action,
  onBack,
  backTo,
}) {
  const navigate = useNavigate();

  function handleBack() {
    if (backTo) navigate(backTo);
    else if (onBack) onBack();
    else navigate(-1);
  }

  return (
    <div className="flex items-start gap-3">
      {onBack !== false && (
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0 -ml-2"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
