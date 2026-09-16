// Format rupiah: 1500000 → "Rp1.500.000"
export function formatRupiah(n) {
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

// Format tanggal ID: "2026-09-12" → "12 Sep 2026"
export function formatDateID(dateStr, opts = {}) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

// Format tanggal panjang: "12 September 2026"
export function formatDateLong(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format tanggal relatif: "Hari ini", "Kemarin", "12 Sep"
export function formatDateRelative(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff === -1) return "Besok";
  return formatDateID(dateStr);
}

// Tanggal hari ini dalam format YYYY-MM-DD
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// Jam sekarang dalam format HH:MM
export function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Group array by key
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

// Truncate text
export function truncate(str, len = 100) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "..." : str;
}
