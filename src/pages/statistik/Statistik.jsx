import { useEffect, useState } from "react";
import { BarChart3, Flame, Calendar, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import {
  getHeatmapData,
  getStreakData,
  getStatistikBulanan,
} from "../../services/statistikService";
import { getProfilLaporan } from "../../services/laporanService";
import { generateSmartSummary } from "../../utils/smartSummary";
import { getKegiatanPeriode } from "../../services/laporanService";
import Heatmap from "../../components/ui/Heatmap";
import StreakCounter from "../../components/ui/StreakCounter";
import SmartSummary from "../../components/ui/SmartSummary";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import Toast from "../../components/ui/Toast";

export default function Statistik() {
  const { user } = useAuth();
  const [heatmapData, setHeatmapData] = useState({});
  const [streak, setStreak] = useState(null);
  const [bulanan, setBulanan] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const [heatmap, streakData, bulananData, profil, kegiatan] =
        await Promise.all([
          getHeatmapData(user.id),
          getStreakData(user.id),
          getStatistikBulanan(user.id),
          getProfilLaporan(user.id),
          getKegiatanPeriode(
            user.id,
            "2000-01-01",
            new Date().toISOString().split("T")[0],
          ),
        ]);

      setHeatmapData(heatmap);
      setStreak(streakData);
      setBulanan(bulananData);
      setSummary(generateSmartSummary(kegiatan, profil));
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Statistik & Analisis
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Lihat progress dan pola kegiatan PKL-mu.
        </p>
      </div>

      {/* Streak */}
      <StreakCounter streak={streak} />

      {/* Heatmap */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Aktivitas 1 Tahun Terakhir
          </h3>
        </div>
        {Object.keys(heatmapData).length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Belum ada data untuk ditampilkan.
          </p>
        ) : (
          <Heatmap data={heatmapData} />
        )}
      </Card>

      {/* Smart Summary */}
      {summary && <SmartSummary summary={summary} />}

      {/* Grafik Bulanan */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Kegiatan Per Bulan (Tahun Ini)
          </h3>
        </div>
        {bulanan.every((b) => b.kegiatan === 0) ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Belum ada kegiatan tahun ini.
          </p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bulanan}>
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="kegiatan" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
