import { useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Wallet,
  Target,
  CalendarCheck,
  CalendarDays,
  FileText,
  StickyNote,
  Settings,
  User,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import { Briefcase } from "lucide-react"; // ← Tambahkan import

const menus = [
  {
    to: "/",
    label: "Dashboard",
    icon: Home,
    color: "text-blue-600 bg-blue-100",
  },
  {
    to: "/kegiatan",
    label: "Kegiatan",
    icon: ClipboardList,
    color: "text-green-600 bg-green-100",
  },
  {
    to: "/keuangan",
    label: "Keuangan",
    icon: Wallet,
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    to: "/target",
    label: "Target",
    icon: Target,
    color: "text-purple-600 bg-purple-100",
  },
  {
    to: "/rencana",
    label: "Rencana",
    icon: CalendarCheck,
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    to: "/kalender",
    label: "Kalender",
    icon: CalendarDays,
    color: "text-pink-600 bg-pink-100",
  },
  {
    to: "/laporan",
    label: "Laporan",
    icon: FileText,
    color: "text-orange-600 bg-orange-100",
  },
  {
    to: "/catatan",
    label: "Catatan",
    icon: StickyNote,
    color: "text-amber-600 bg-amber-100",
  },
  {
    to: "/statistik",
    label: "Statistik",
    icon: BarChart3,
    color: "text-cyan-600 bg-cyan-100",
  }, // ✅ BARU
  {
    to: "/layanan",
    label: "Layanan",
    icon: Briefcase,
    color: "text-rose-600 bg-rose-100",
  }, // ← TAMBAHKAN INI
  {
    to: "/pengaturan",
    label: "Pengaturan",
    icon: Settings,
    color: "text-gray-600 bg-gray-100",
  },
];

export default function MenuLengkap() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Header profil */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
            {(profile?.nama || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {profile?.nama || "Pengguna"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {profile?.sekolah || "Sekolah belum diatur"}
            </p>
            {profile?.tempat_pkl && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-0.5">
                <span></span> {profile.tempat_pkl}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/pengaturan")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Menu Grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-1">
          Menu Utama
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {menus.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.to}
                onClick={() => navigate(m.to)}
                className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info PKL */}
      {profile?.tempat_pkl && (
        <Card className="p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Sedang PKL di
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {profile.tempat_pkl}
          </p>
          {profile.tanggal_mulai && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(profile.tanggal_mulai).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {profile.tanggal_selesai &&
                ` — ${new Date(profile.tanggal_selesai).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}`}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
