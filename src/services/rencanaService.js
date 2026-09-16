import { supabase } from "../lib/supabase";

export async function getRencanaList(userId, { tanggal, selesai } = {}) {
  let query = supabase
    .from("rencana")
    .select("*")
    .eq("user_id", userId)
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false });

  if (tanggal) query = query.eq("tanggal", tanggal);
  if (typeof selesai === "boolean") query = query.eq("selesai", selesai);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createRencana(userId, values) {
  const { data, error } = await supabase
    .from("rencana")
    .insert({ user_id: userId, ...values })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRencana(userId, id, values) {
  const { data, error } = await supabase
    .from("rencana")
    .update(values)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRencana(userId, id) {
  const { error } = await supabase
    .from("rencana")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

/** Toggle selesai (untuk checkbox) */
export async function toggleRencana(userId, id, selesai) {
  return updateRencana(userId, id, { selesai });
}
