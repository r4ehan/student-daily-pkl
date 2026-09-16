import { Sparkles, BookOpen, Wrench, TrendingUp } from "lucide-react";
import Card from "./Card";

export default function SmartSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="space-y-3">
      {/* Narasi Utama */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-purple-50 dark:from-primary/10 dark:to-purple-900/20 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Ringkasan Otomatis
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary.ringkasan}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {summary.stats && (
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="Hari" value={summary.stats.totalHari} />
          <MiniStat label="Kegiatan" value={summary.stats.totalKegiatan} />
          <MiniStat
            label="Rata-rata/hari"
            value={summary.stats.avgKegiatanPerHari}
          />
        </div>
      )}

      {/* Top Tema */}
      {summary.topTema?.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Fokus Utama
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.topTema.map((tema) => (
              <span
                key={tema}
                className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full capitalize"
              >
                {tema}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Skills */}
      {summary.skills?.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Tools & Skills
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full capitalize"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Highlights */}
      {summary.highlights?.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Momen Penting
            </h4>
          </div>
          <ul className="space-y-2">
            {summary.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-amber-500 mt-1">✦</span>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">{h.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(h.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
