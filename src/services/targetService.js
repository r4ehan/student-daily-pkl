import { supabase } from "../lib/supabase";

export async function getTargetList(userId, { status } = {}) {
  let query = supabase
    .from("target")
    .select("*")
    .eq("user_id", userId)
    .order("status", { ascending: true }) // aktif dulu
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getTargetById(userId, id) {
  const { data, error } = await supabase
    .from("target")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createTarget(userId, values) {
  const { data, error } = await supabase
    .from("target")
    .insert({ user_id: userId, ...values })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTarget(userId, id, values) {
  const { data, error } = await supabase
    .from("target")
    .update(values)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTarget(userId, id) {
  const { error } = await supabase
    .from("target")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

/**
 * Tambah nominal ke target (quick action).
 * Otomatis tandai selesai jika sudah tercapai.
 */
export async function addNominalToTarget(userId, id, tambahan) {
  const current = await getTargetById(userId, id);
  if (!current) throw new Error("Target tidak ditemukan");

  const newTotal = Number(current.nominal_terkumpul) + Number(tambahan);
  const isReached = newTotal >= Number(current.target_nominal);

  const { data, error } = await supabase
    .from("target")
    .update({
      nominal_terkumpul: newTotal,
      status: isReached ? "selesai" : current.status,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return {
    data,
    justReached:
      isReached && current.nominal_terkumpul < current.target_nominal,
  };
}
