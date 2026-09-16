import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * @param {Date} value - bulan yang ditampilkan (tanggal berapa saja, yang penting month & year)
 * @param {Function} onChange - (newDate: Date) => void
 * @param {Object} markers - { 'YYYY-MM-DD': { kegiatan: bool, transaksi: bool, target: bool, notes: bool } }
 * @param {string} selected - 'YYYY-MM-DD' tanggal yang dipilih
 * @param {Function} onSelectDate - (dateStr) => void
 */
export default function Calendar({
  value,
  onChange,
  markers = {},
  selected,
  onSelectDate,
}) {
  const year = value.getFullYear();
  const month = value.getMonth();

  // Hitung grid tanggal
  const grid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay(); // 0 = Minggu
    const totalDays = lastDay.getDate();

    const cells = [];
    // Padding awal (hari bulan sebelumnya)
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({
        day: prevLastDay - i,
        date: null,
        inMonth: false,
      });
    }
    // Hari di bulan ini
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        date: dateStr,
        inMonth: true,
        isToday: dateStr === new Date().toISOString().split("T")[0],
      });
    }
    // Padding akhir sampai penuh 6 baris (42 cells)
    while (cells.length < 42) {
      cells.push({
        day: cells.length - (startOffset + totalDays) + 1,
        date: null,
        inMonth: false,
      });
    }
    return cells;
  }, [year, month]);

  function prevMonth() {
    onChange(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    onChange(new Date(year, month + 1, 1));
  }
  function goToday() {
    onChange(new Date());
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <button
            onClick={goToday}
            className="font-semibold text-gray-900 hover:text-primary"
          >
            {MONTHS[month]} {year}
          </button>
        </div>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid tanggal */}
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((cell, i) => {
          const marker = cell.date ? markers[cell.date] : null;
          const hasAny =
            marker &&
            (marker.kegiatan ||
              marker.transaksi ||
              marker.target ||
              marker.notes);
          const isSelected = cell.date === selected;

          return (
            <button
              key={i}
              onClick={() => cell.date && onSelectDate?.(cell.date)}
              disabled={!cell.inMonth}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                !cell.inMonth
                  ? "text-gray-300 cursor-default"
                  : isSelected
                    ? "bg-primary text-white font-semibold"
                    : cell.isToday
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{cell.day}</span>
              {hasAny && (
                <div className="flex gap-0.5 mt-0.5 absolute bottom-1">
                  {marker.kegiatan && (
                    <span
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-green-500"}`}
                    />
                  )}
                  {marker.transaksi && (
                    <span
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-blue-500"}`}
                    />
                  )}
                  {marker.target && (
                    <span
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-purple-500"}`}
                    />
                  )}
                  {marker.notes && (
                    <span
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-amber-500"}`}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
        <LegendDot color="bg-green-500" label="Kegiatan" />
        <LegendDot color="bg-blue-500" label="Transaksi" />
        <LegendDot color="bg-purple-500" label="Target" />
        <LegendDot color="bg-amber-500" label="Catatan" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
