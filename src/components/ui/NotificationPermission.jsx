import { useState } from "react";
import { Bell, BellOff, CheckCircle2, X } from "lucide-react";
import useDailyNotifications from "../../hooks/useDailyNotifications";

export default function NotificationPermission() {
  const { permission, scheduled, enableNotifications, isSupported } =
    useDailyNotifications();
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isSupported) return null;
  if (dismissed) return null;
  if (permission === "granted" && scheduled) return null;

  async function handleEnable() {
    setLoading(true);
    await enableNotifications();
    setLoading(false);
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40"
      >
        <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            Aktifkan Notifikasi Harian
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            aktifkan notifikasi harian untuk melihat hal baru dalam aplikasi
          </p>

          {permission === "granted" && !scheduled && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Notifikasi sudah dijadwalkan
            </p>
          )}

          <button
            onClick={handleEnable}
            disabled={loading}
            className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Aktifkan Notifikasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
