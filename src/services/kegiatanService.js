import { supabase } from "../lib/supabase";

// Helper untuk membersihkan field waktu agar tidak error di PostgreSQL
function cleanTimeFields(values) {
  return {
    ...values,
    jam_mulai: values.jam_mulai === "" ? null : values.jam_mulai,
    jam_selesai: values.jam_selesai === "" ? null : values.jam_selesai,
  };
}

export async function getKegiatanList(
  userId,
  { search = "", month = "", year = "" } = {},
) {
  if (!userId) {
    console.warn("⚠️ getKegiatanList dipanggil tanpa userId");
    return [];
  }

  let query = supabase
    .from("kegiatan")
    .select("*")
    .eq("user_id", userId)
    .order("tanggal", { ascending: false })
    .order("jam_mulai", { ascending: false, nullsFirst: false });

  if (search.trim()) {
    query = query.ilike("kegiatan", `%${search.trim()}%`);
  }
  if (month && year) {
    const m = String(month).padStart(2, "0");
    const startDate = `${year}-${m}-01`;
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const endDate = `${year}-${m}-${String(lastDay).padStart(2, "0")}`;
    query = query.gte("tanggal", startDate).lte("tanggal", endDate);
  }

  const { data, error } = await query;
  if (error) {
    console.error("❌ Supabase Error Detail (getKegiatanList):", error);
    throw error;
  }
  return data || [];
}

export async function getKegiatanById(userId, id) {
  if (!userId || !id) return null;

  const { data, error } = await supabase
    .from("kegiatan")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase Error Detail (getKegiatanById):", error);
    throw error;
  }
  return data;
}

export async function createKegiatan(userId, values) {
  const cleanValues = cleanTimeFields(values);

  const { data, error } = await supabase
    .from("kegiatan")
    .insert({ user_id: userId, ...cleanValues })
    .select()
    .single();

  if (error) {
    console.error("❌ Supabase Error Detail (createKegiatan):", error);
    throw error;
  }
  return data;
}

export async function updateKegiatan(userId, id, values) {
  const cleanValues = cleanTimeFields(values);

  const { data, error } = await supabase
    .from("kegiatan")
    .update(cleanValues)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("❌ Supabase Error Detail (updateKegiatan):", error);
    throw error;
  }
  return data;
}

export async function deleteKegiatan(userId, id) {
  const { error } = await supabase
    .from("kegiatan")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Supabase Error Detail (deleteKegiatan):", error);
    throw error;
  }
}

export async function hasKegiatanToday(userId) {
  if (!userId) return false;
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("kegiatan")
    .select("id")
    .eq("user_id", userId)
    .eq("tanggal", today)
    .limit(1);

  if (error) {
    console.error("❌ Supabase Error Detail (hasKegiatanToday):", error);
    return false;
  }
  return (data?.length || 0) > 0;
}
