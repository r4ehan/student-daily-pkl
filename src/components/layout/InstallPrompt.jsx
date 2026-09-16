import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Tampilkan banner setelah 5 detik jika belum di-install
      const dismissed = localStorage.getItem("install-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 5000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem("install-dismissed", "true");
  }

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:bottom-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom-4">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            Install Aplikasi
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Tambahkan ke home screen untuk akses cepat.
          </p>
          <button
            onClick={handleInstall}
            className="mt-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-blue-700"
          >
            Install Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
