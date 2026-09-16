import { useMemo } from "react";

const DAYS = ["Sen", "", "Rab", "", "Jum", "", ""];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function Heatmap({ data = {}, year }) {
  const currentYear = year || new Date().getFullYear();

  const grid = useMemo(() => {
    const weeks = [];
    const startDate = new Date(currentYear, 0, 1);
    // Mundur ke hari Senin pertama
    const dayOfWeek = startDate.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - offset);

    const endDate = new Date(currentYear, 11, 31);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const count = data[dateStr] || 0;
        week.push({
          date: dateStr,
          count,
          inYear: currentDate.getFullYear() === currentYear,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  }, [currentYear, data]);

  function getColor(count) {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count === 1) return "bg-green-200 dark:bg-green-900/40";
    if (count === 2) return "bg-green-400 dark:bg-green-700";
    if (count === 3) return "bg-green-600 dark:bg-green-600";
    return "bg-green-800 dark:bg-green-500";
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-[700px]">
        {/* Label hari */}
        <div className="flex flex-col gap-1 pr-1 text-[10px] text-gray-400">
          {DAYS.map((d, i) => (
            <div key={i} className="h-3 leading-3">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1 flex-1">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.count} kegiatan`}
                  className={`w-3 h-3 rounded-sm ${getColor(day.count)} ${
                    !day.inYear ? "opacity-30" : ""
                  } hover:ring-1 hover:ring-primary transition-all cursor-pointer`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-500 justify-end">
        <span>Sedikit</span>
        {[0, 1, 2, 3, 4].map((n) => (
          <div key={n} className={`w-3 h-3 rounded-sm ${getColor(n)}`} />
        ))}
        <span>Banyak</span>
      </div>
    </div>
  );
}
