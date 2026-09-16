import { supabase } from "../lib/supabase";

/**
 * Ambil aktivitas user dalam rentang tanggal.
 * Return: {
 *   kegiatan: { '2026-09-12': [ {...}, ... ] },
 *   transaksi: { '2026-09-12': [ {...}, ... ] },
 *   target: [ {...}, ... ], // target dengan deadline di rentang
 *   notes: { '2026-09-12': [ {...}, ... ] },
 * }
 */
export async function getAktivitasBulan(userId, startDate, endDate) {
  const [kegRes, trxRes, tgtRes, notesRes] = await Promise.all([
    supabase
      .from("kegiatan")
      .select("id, tanggal, kegiatan")
      .eq("user_id", userId)
      .gte("tanggal", startDate)
      .lte("tanggal", endDate)
      .order("tanggal", { ascending: true }),
    supabase
      .from("transaksi")
      .select("id, tanggal, jenis, nominal")
      .eq("user_id", userId)
      .gte("tanggal", startDate)
      .lte("tanggal", endDate)
      .order("tanggal", { ascending: true }),
    supabase
      .from("target")
      .select("id, nama_target, deadline, status")
      .eq("user_id", userId)
      .not("deadline", "is", null)
      .gte("deadline", startDate)
      .lte("deadline", endDate),
    supabase
      .from("notes")
      .select("id, judul, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`),
  ]);

  if (kegRes.error) throw kegRes.error;
  if (trxRes.error) throw trxRes.error;
  if (tgtRes.error) throw tgtRes.error;
  if (notesRes.error) throw notesRes.error;

  // Group by tanggal
  const groupByDate = (arr, dateKey = "tanggal") => {
    const map = {};
    (arr || []).forEach((item) => {
      let d = item[dateKey];
      if (dateKey === "created_at") d = d.split("T")[0];
      if (!map[d]) map[d] = [];
      map[d].push(item);
    });
    return map;
  };

  return {
    kegiatan: groupByDate(kegRes.data),
    transaksi: groupByDate(trxRes.data),
    target: tgtRes.data || [],
    notes: groupByDate(notesRes.data, "created_at"),
  };
}

/**
 * Ambil semua aktivitas di 1 tanggal spesifik (untuk detail di bawah kalender).
 */
export async function getAktivitasTanggal(userId, tanggal) {
  const [kegRes, trxRes, rncRes, notesRes] = await Promise.all([
    supabase
      .from("kegiatan")
      .select("id, tanggal, jam_mulai, jam_selesai, kegiatan, foto_url")
      .eq("user_id", userId)
      .eq("tanggal", tanggal)
      .order("jam_mulai", { ascending: true }),
    supabase
      .from("transaksi")
      .select("id, tanggal, jenis, kategori, nominal, catatan")
      .eq("user_id", userId)
      .eq("tanggal", tanggal)
      .order("created_at", { ascending: true }),
    supabase
      .from("rencana")
      .select("id, isi, selesai")
      .eq("user_id", userId)
      .eq("tanggal", tanggal),
    supabase
      .from("notes")
      .select("id, judul, isi, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${tanggal}T00:00:00`)
      .lte("created_at", `${tanggal}T23:59:59`),
  ]);

  if (kegRes.error) throw kegRes.error;
  if (trxRes.error) throw trxRes.error;
  if (rncRes.error) throw rncRes.error;
  if (notesRes.error) throw notesRes.error;

  return {
    kegiatan: kegRes.data || [],
    transaksi: trxRes.data || [],
    rencana: rncRes.data || [],
    notes: notesRes.data || [],
  };
}
