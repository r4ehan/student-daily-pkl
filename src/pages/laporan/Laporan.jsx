import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getStatistikLaporan,
  getProfilLaporan,
} from "../../services/laporanService";
import { todayISO } from "../../utils/helpers";
import PeriodFilter from "../../components/ui/PeriodFilter";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import Toast from "../../components/ui/Toast";

export default function Laporan() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [period, setPeriod] = useState({
    preset: "month",
    startDate: null,
    endDate: null,
  });

  // ✅ Variabel stats didefinisikan di sini agar tidak error
  const [stats, setStats] = useState(null);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) load();
  }, [user, period]);

  async function load() {
    setLoading(true);
    try {
      const [statsData, profilData] = await Promise.all([
        getStatistikLaporan(
          user.id,
          period.startDate || "2000-01-01",
          period.endDate || todayISO(),
        ),
        getProfilLaporan(user.id),
      ]);
      setStats(statsData);
      setProfil(profilData);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  const periodLabel = {
    today: "Hari ini",
    week: "Minggu ini",
    month: "Bulan ini",
    all: "Semua waktu",
    custom: `${period.startDate} — ${period.endDate}`,
  }[period.preset];

  // ✅ Fungsi ini menerima parameter 'type' untuk memilih format
  function handleGenerate(type) {
    if (!stats || stats.totalKegiatan === 0) {
      setToast({
        type: "error",
        message: "Tidak ada kegiatan dalam periode ini.",
      });
      return;
    }

    const path =
      type === "table" ? "/laporan/preview-tabel" : "/laporan/preview";
    navigate(path, {
      state: {
        period: periodLabel,
        startDate: period.startDate,
        endDate: period.endDate,
      },
    });
  }

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Laporan PKL
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Rekap dan generator bahan laporan.
        </p>
      </div>

      {/* Period Filter */}
      <Card className="p-3">
        <PeriodFilter value={period} onChange={setPeriod} />
      </Card>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Statistik */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Total Kegiatan"
              value={stats?.totalKegiatan || 0}
              icon={FileText}
              color="blue"
            />
            <StatCard
              label="Total Hari"
              value={stats?.totalHari || 0}
              icon={Calendar}
              color="green"
            />
            <StatCard
              label="Per Minggu"
              value={Object.keys(stats?.byWeek || {}).length}
              icon={TrendingUp}
              color="purple"
            />
            <StatCard
              label="Per Bulan"
              value={Object.keys(stats?.byMonth || {}).length}
              icon={TrendingUp}
              color="orange"
            />
          </div>

          {/* Info PKL */}
          {profil && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Informasi PKL
              </h3>
              <div className="space-y-2 text-sm">
                <InfoRow label="Nama" value={profil.nama} />
                <InfoRow label="Kelas" value={profil.kelas} />
                <InfoRow label="Jurusan" value={profil.jurusan} />
                <InfoRow label="Sekolah" value={profil.sekolah} />
                <InfoRow label="Tempat PKL" value={profil.tempat_pkl} />
              </div>
            </Card>
          )}

          {/* ✅ GENERATE BUTTONS (2 OPSI FORMAT) */}
          <Card className="p-5">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Generator Bahan Laporan
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Pilih format laporan yang ingin kamu buat.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => handleGenerate("narrative")}
                  disabled={!stats || stats.totalKegiatan === 0}
                  size="lg"
                  className="flex-1"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Format Narasi (Teks)
                </Button>

                <Button
                  onClick={() => handleGenerate("table")}
                  disabled={!stats || stats.totalKegiatan === 0}
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Format Tabel (dengan Paraf)
                </Button>
              </div>

              {stats && stats.totalKegiatan === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Tidak ada kegiatan dalam periode ini. Pilih periode lain atau
                  catat kegiatan terlebih dahulu.
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex">
      <span className="w-32 text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-900 dark:text-gray-100 font-medium">
        : {value || "-"}
      </span>
    </div>
  );
}
