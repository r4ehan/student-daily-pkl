import { supabase } from "../lib/supabase";

/**
 * Ambil semua kegiatan dalam rentang tanggal.
 */
export async function getKegiatanPeriode(userId, startDate, endDate) {
  let query = supabase
    .from("kegiatan")
    .select("*")
    .eq("user_id", userId)
    .gte("tanggal", startDate)
    .lte("tanggal", endDate)
    .order("tanggal", { ascending: true })
    .order("jam_mulai", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Hitung statistik laporan.
 */
export async function getStatistikLaporan(userId, startDate, endDate) {
  const kegiatan = await getKegiatanPeriode(userId, startDate, endDate);

  // Total hari unik
  const uniqueDays = new Set(kegiatan.map((k) => k.tanggal)).size;

  // Group by minggu
  const byWeek = {};
  kegiatan.forEach((k) => {
    const d = new Date(k.tanggal);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split("T")[0];
    if (!byWeek[key]) byWeek[key] = 0;
    byWeek[key]++;
  });

  // Group by bulan
  const byMonth = {};
  kegiatan.forEach((k) => {
    const d = new Date(k.tanggal);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = 0;
    byMonth[key]++;
  });

  return {
    totalKegiatan: kegiatan.length,
    totalHari: uniqueDays,
    byWeek,
    byMonth,
    kegiatan,
  };
}

/**
 * Ambil profil user untuk header laporan.
 */
export async function getProfilLaporan(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "nama, kelas, jurusan, sekolah, tempat_pkl, tanggal_mulai, tanggal_selesai",
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
