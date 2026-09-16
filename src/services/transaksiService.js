import { supabase } from "../lib/supabase";

/**
 * Ambil list transaksi dengan filter.
 * @param {string} userId
 * @param {Object} options
 * @param {string} options.startDate - YYYY-MM-DD
 * @param {string} options.endDate - YYYY-MM-DD
 * @param {string} options.jenis - 'pemasukan' | 'pengeluaran'
 */
export async function getTransaksiList(
  userId,
  { startDate, endDate, jenis } = {},
) {
  let query = supabase
    .from("transaksi")
    .select("*")
    .eq("user_id", userId)
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false });

  if (startDate) query = query.gte("tanggal", startDate);
  if (endDate) query = query.lte("tanggal", endDate);
  if (jenis) query = query.eq("jenis", jenis);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Ambil ringkasan keuangan dalam rentang tanggal.
 * Return: { pemasukan, pengeluaran, saldo, count }
 */
export async function getRingkasanKeuangan(
  userId,
  { startDate, endDate } = {},
) {
  let query = supabase
    .from("transaksi")
    .select("jenis, nominal")
    .eq("user_id", userId);

  if (startDate) query = query.gte("tanggal", startDate);
  if (endDate) query = query.lte("tanggal", endDate);

  const { data, error } = await query;
  if (error) throw error;

  const result = { pemasukan: 0, pengeluaran: 0, saldo: 0, count: 0 };
  (data || []).forEach((t) => {
    result.count += 1;
    if (t.jenis === "pemasukan") result.pemasukan += Number(t.nominal);
    else result.pengeluaran += Number(t.nominal);
  });
  result.saldo = result.pemasukan - result.pengeluaran;
  return result;
}

/**
 * Ambil data per bulan untuk grafik (12 bulan terakhir).
 * Return: [{ bulan: 'Sep 2026', pemasukan: 100000, pengeluaran: 50000 }, ...]
 */
export async function getGrafikBulanan(userId) {
  // Ambil 12 bulan terakhir
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const startDate = start.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transaksi")
    .select("tanggal, jenis, nominal")
    .eq("user_id", userId)
    .gte("tanggal", startDate)
    .order("tanggal", { ascending: true });

  if (error) throw error;

  // Group by bulan
  const map = {};
  (data || []).forEach((t) => {
    const d = new Date(t.tanggal);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { bulan: key, pemasukan: 0, pengeluaran: 0 };
    if (t.jenis === "pemasukan") map[key].pemasukan += Number(t.nominal);
    else map[key].pengeluaran += Number(t.nominal);
  });

  // Isi bulan yang kosong
  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
    result.push({
      bulan: label,
      pemasukan: map[key]?.pemasukan || 0,
      pengeluaran: map[key]?.pengeluaran || 0,
    });
  }
  return result;
}

export async function createTransaksi(userId, values) {
  const { data, error } = await supabase
    .from("transaksi")
    .insert({ user_id: userId, ...values })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTransaksiById(userId, id) {
  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateTransaksi(userId, id, values) {
  const { data, error } = await supabase
    .from("transaksi")
    .update(values)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTransaksi(userId, id) {
  const { error } = await supabase
    .from("transaksi")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
