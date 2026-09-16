import { supabase } from "../lib/supabase";

/**
 * Ambil data kegiatan per hari untuk heatmap (1 tahun terakhir).
 * Return: { 'YYYY-MM-DD': count }
 */
export async function getHeatmapData(userId) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const startDate = oneYearAgo.toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("kegiatan")
    .select("tanggal")
    .eq("user_id", userId)
    .gte("tanggal", startDate)
    .lte("tanggal", endDate);

  if (error) throw error;

  const map = {};
  (data || []).forEach((k) => {
    map[k.tanggal] = (map[k.tanggal] || 0) + 1;
  });
  return map;
}

/**
 * Hitung streak hari berturut-turut dengan kegiatan.
 * Return: { current: number, longest: number, lastActive: string }
 */
export async function getStreakData(userId) {
  const { data, error } = await supabase
    .from("kegiatan")
    .select("tanggal")
    .eq("user_id", userId)
    .order("tanggal", { ascending: false });

  if (error) throw error;

  if (!data || data.length === 0) {
    return { current: 0, longest: 0, lastActive: null };
  }

  const uniqueDays = [...new Set(data.map((k) => k.tanggal))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];

  // Hitung current streak
  let current = 0;
  let checkDate = new Date(today);

  for (const day of uniqueDays) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if (day === checkStr) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (new Date(day) < checkDate) {
      break;
    }
  }

  // Hitung longest streak
  let longest = 0;
  let tempStreak = 1;
  const sortedAsc = [...uniqueDays].sort();

  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1]);
    const curr = new Date(sortedAsc[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  return {
    current,
    longest,
    lastActive: uniqueDays[0],
  };
}

/**
 * Statistik bulanan untuk grafik.
 */
export async function getStatistikBulanan(userId) {
  const thisYear = new Date().getFullYear();
  const startDate = `${thisYear}-01-01`;
  const endDate = `${thisYear}-12-31`;

  const { data, error } = await supabase
    .from("kegiatan")
    .select("tanggal")
    .eq("user_id", userId)
    .gte("tanggal", startDate)
    .lte("tanggal", endDate);

  if (error) throw error;

  const months = Array.from({ length: 12 }, (_, i) => ({
    bulan: new Date(thisYear, i, 1).toLocaleDateString("id-ID", {
      month: "short",
    }),
    kegiatan: 0,
  }));

  (data || []).forEach((k) => {
    const month = new Date(k.tanggal).getMonth();
    months[month].kegiatan++;
  });

  return months;
}
