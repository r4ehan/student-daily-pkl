import { Calendar } from "lucide-react";

const PRESETS = [
  { value: "today", label: "Hari ini" },
  { value: "week", label: "Minggu ini" },
  { value: "month", label: "Bulan ini" },
  { value: "all", label: "Semua" },
  { value: "custom", label: "Custom" },
];

export default function PeriodFilter({ value, onChange }) {
  // value: { preset: 'month', startDate, endDate }

  function handlePreset(preset) {
    const today = new Date();
    let startDate = null;
    let endDate = today.toISOString().split("T")[0];

    if (preset === "today") {
      startDate = endDate;
    } else if (preset === "week") {
      const d = new Date(today);
      d.setDate(d.getDate() - d.getDay()); // Minggu
      startDate = d.toISOString().split("T")[0];
    } else if (preset === "month") {
      startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    } else if (preset === "all") {
      startDate = null;
      endDate = null;
    }

    onChange({ preset, startDate, endDate });
  }

  function handleCustom(field, val) {
    onChange({
      preset: "custom",
      startDate: field === "start" ? val : value.startDate,
      endDate: field === "end" ? val : value.endDate,
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              value.preset === p.value
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {value.preset === "custom" && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={value.startDate || ""}
            onChange={(e) => handleCustom("start", e.target.value)}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="date"
            value={value.endDate || ""}
            onChange={(e) => handleCustom("end", e.target.value)}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
}
