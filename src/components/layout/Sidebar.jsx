import { NavLink, useNavigate } from "react-router-dom";
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
  LogOut,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "../../services/authService";
import ThemeToggle from "../ui/ThemeToggle";
import { Briefcase } from "lucide-react"; // ← Tambahkan import

const menu = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/kegiatan", label: "Kegiatan", icon: ClipboardList },
  { to: "/keuangan", label: "Keuangan", icon: Wallet },
  { to: "/target", label: "Target", icon: Target },
  { to: "/rencana", label: "Rencana", icon: CalendarCheck },
  { to: "/kalender", label: "Kalender", icon: CalendarDays },
  { to: "/laporan", label: "Laporan", icon: FileText },
  { to: "/catatan", label: "Catatan", icon: StickyNote },
  { to: "/statistik", label: "Statistik", icon: BarChart3 },
  { to: "/layanan", label: "Layanan", icon: Briefcase }, // ← TAMBAHKAN INI
  { to: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">Student Daily</h1>
        <p className="text-xs text-gray-500">PKL Tracker</p>
        <div className="mt-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-primary font-medium dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Profil & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {(profile?.nama || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.nama || "Pengguna"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.tempat_pkl || "Belum diatur"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-gray-200 rounded-lg"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
