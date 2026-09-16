import { supabase } from "../lib/supabase";

const BUCKET = "dokumentasi";

/**
 * Upload foto kegiatan.
 * Path: {userId}/{kegiatanId}/{timestamp}.{ext}
 */
export async function uploadFoto(userId, kegiatanId, file) {
  if (!file) return null;

  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${userId}/${kegiatanId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, cacheControl: "3600" });

  if (error) throw error;
  return path;
}

/**
 * Hapus file dari storage.
 */
export async function deleteFoto(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn("Gagal hapus foto:", error.message);
}

/**
 * Ambil URL publik dari path.
 */
export function getFotoUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
