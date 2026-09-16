import { supabase } from "../lib/supabase";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(userId, values) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...values }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}
