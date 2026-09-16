import { supabase } from "../lib/supabase";

export async function getNotesList(userId, { search = "" } = {}) {
  let query = supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (search.trim()) {
    query = query.or(
      `judul.ilike.%${search.trim()}%,isi.ilike.%${search.trim()}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getNoteById(userId, id) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createNote(userId, values) {
  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: userId, ...values })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(userId, id, values) {
  const { data, error } = await supabase
    .from("notes")
    .update(values)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(userId, id) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
