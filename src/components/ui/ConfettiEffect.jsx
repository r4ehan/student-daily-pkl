import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiEffect({ trigger, duration = 3000 }) {
  useEffect(() => {
    if (!trigger) return;

    // Efek confetti dari bawah ke atas
    const end = Date.now() + duration;

    const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 1 }, // bawah kiri
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 1 }, // bawah kanan
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Efek tambahan: burst dari tengah
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
      });
    }, 300);
  }, [trigger, duration]);

  return null;
}
