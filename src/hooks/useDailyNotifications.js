import { useEffect, useState } from "react";
import {
  isNotificationSupported,
  requestNotificationPermission,
  scheduleDailyNotifications,
  shouldReschedule,
} from "../services/notificationService";

export default function useDailyNotifications() {
  const [permission, setPermission] = useState(
    isNotificationSupported() ? Notification.permission : "unsupported",
  );
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    if (!isNotificationSupported()) return;

    // Auto-schedule jika permission granted dan belum schedule hari ini
    if (Notification.permission === "granted") {
      if (shouldReschedule()) {
        const ids = scheduleDailyNotifications();
        setScheduled(ids.length > 0);
      }
    }

    // Re-schedule setiap jam (untuk handle jika laptop/HP sleep)
    const interval = setInterval(
      () => {
        if (Notification.permission === "granted" && shouldReschedule()) {
          const ids = scheduleDailyNotifications();
          setScheduled(ids.length > 0);
        }
      },
      60 * 60 * 1000,
    ); // setiap 1 jam

    return () => clearInterval(interval);
  }, []);

  async function enableNotifications() {
    const result = await requestNotificationPermission();
    setPermission(result);

    if (result === "granted") {
      const ids = scheduleDailyNotifications();
      setScheduled(ids.length > 0);
    }

    return result;
  }

  return {
    permission,
    scheduled,
    enableNotifications,
    isSupported: isNotificationSupported(),
  };
}
