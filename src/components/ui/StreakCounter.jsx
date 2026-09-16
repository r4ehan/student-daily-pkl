import { Flame, Trophy, Calendar } from "lucide-react";
import Card from "./Card";

export default function StreakCounter({ streak }) {
  if (!streak) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="p-4 text-center">
        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
          <Flame className="w-5 h-5 text-orange-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {streak.current}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Streak Saat Ini
        </p>
      </Card>

      <Card className="p-4 text-center">
        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {streak.longest}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Streak Terpanjang
        </p>
      </Card>

      <Card className="p-4 text-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {streak.lastActive
            ? new Date(streak.lastActive).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })
            : "-"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Terakhir Aktif
        </p>
      </Card>
    </div>
  );
}
