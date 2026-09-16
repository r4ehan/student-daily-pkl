// Konfigurasi notifikasi harian
export const DAILY_NOTIFICATIONS = [
  {
    id: "morning_motivation",
    time: "08:00",
    title: "Selamat Pagi! ☀️",
    message: "Semangat PKL-nya hari ini! Jangan lupa catat kegiatanmu ya.",
    icon: "/icon-192.png",
  },
  {
    id: "lunch_reminder",
    time: "12:00",
    title: "Istirahat Dulu 🍱",
    message: "Jangan lupa makan siang! Istirahat sejenak agar tetap fokus.",
    icon: "/icon-192.png",
  },
  {
    id: "evening_report",
    time: "21:00",
    title: "Waktunya Catat 📝",
    message:
      "Jangan lupa isi laporan kegiatan hari ini dan siapkan istirahat. Tidur yang cukup ya!",
    icon: "/icon-192.png",
  },
];

/**
 * Cek apakah browser support notifikasi
 */
export function isNotificationSupported() {
  return "Notification" in window && "serviceWorker" in navigator;
}

/**
 * Minta izin notifikasi dari user
 * Return: 'granted' | 'denied' | 'default' | 'unsupported'
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Tampilkan notifikasi lokal
 */
export function showNotification({ title, message, icon }) {
  if (Notification.permission !== "granted") return;

  const options = {
    body: message,
    icon: icon || "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    tag: "student-daily-pkl",
    requireInteraction: false,
  };

  // Coba pakai Service Worker (lebih reliable di background)
  if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, options);
    });
  } else {
    // Fallback ke Notification API biasa
    new Notification(title, options);
  }
}

/**
 * Hitung delay (ms) dari sekarang ke waktu target hari ini.
 * Jika waktu sudah lewat, return null (skip hari ini).
 */
export function getDelayToTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  const delay = target.getTime() - now.getTime();

  // Jika sudah lewat hari ini, skip (return null)
  if (delay <= 0) return null;

  return delay;
}

/**
 * Schedule semua notifikasi harian.
 * Return array timeout IDs agar bisa di-cancel.
 */
export function scheduleDailyNotifications() {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return [];
  }

  const timeoutIds = [];

  DAILY_NOTIFICATIONS.forEach((notif) => {
    const delay = getDelayToTime(notif.time);

    if (delay !== null) {
      const timeoutId = setTimeout(() => {
        showNotification(notif);
      }, delay);
      timeoutIds.push(timeoutId);

      console.log(
        ` Notifikasi "${notif.title}" dijadwalkan pada ${notif.time} (delay: ${Math.round(delay / 60000)} menit)`,
      );
    } else {
      console.log(
        `️ Notifikasi "${notif.title}" pada ${notif.time} sudah lewat hari ini`,
      );
    }
  });

  // Simpan info schedule ke localStorage
  localStorage.setItem(
    "notif_schedule_date",
    new Date().toISOString().split("T")[0],
  );

  return timeoutIds;
}

/**
 * Cancel semua scheduled notifications
 */
export function cancelDailyNotifications() {
  // Hapus dari localStorage
  localStorage.removeItem("notif_schedule_date");
  // Note: timeout IDs tidak bisa di-cancel dari luar,
  // tapi akan otomatis expire di akhir hari
}

/**
 * Cek apakah perlu re-schedule (ganti hari)
 */
export function shouldReschedule() {
  const lastSchedule = localStorage.getItem("notif_schedule_date");
  const today = new Date().toISOString().split("T")[0];
  return lastSchedule !== today;
}
