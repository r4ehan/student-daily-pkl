import { useState, useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Tampilkan animasi selama 2.5 detik agar user sempat menikmati efeknya
    const timer = setTimeout(() => {
      setIsExiting(true); // Mulai animasi keluar

      // Setelah animasi keluar selesai (0.6 detik), panggil onFinish
      const finishTimer = setTimeout(() => {
        onFinish();
      }, 600);

      return () => clearTimeout(finishTimer);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300 ${
        isExiting ? "animate-splash-exit" : ""
      }`}
    >
      {/* Container Logo dengan Efek Glow */}
      <div className="animate-splash-pop mb-6 relative">
        {/* Lingkaran glow di belakang logo */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-splash-glow" />

        {/* Logo Utama */}
        <img
          src="/icon-512.png"
          alt="Student Daily PKL Logo"
          className="relative w-28 h-28 sm:w-32 sm:h-32 drop-shadow-2xl"
        />
      </div>

      {/* Teks Aplikasi */}
      <div className="animate-splash-text text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Student Daily
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-1 w-1 rounded-full bg-primary" />
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">
            PKL Tracker
          </p>
          <div className="h-1 w-1 rounded-full bg-primary" />
        </div>
      </div>

      {/* Loading Bar Premium di Bawah */}
      <div className="absolute bottom-24 w-48 h-1.5 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
          style={{
            width: "40%",
            animation: "loading 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Tambahkan keyframe loading di style tag jika belum ada di tailwind */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
