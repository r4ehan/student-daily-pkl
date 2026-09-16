/**
 * Normalize error dari Supabase / network / lainnya
 * agar pesan user-friendly.
 */
export function normalizeError(err) {
  if (!err)
    return { code: "UNKNOWN", message: "Terjadi kesalahan tidak diketahui." };

  // Supabase error
  if (err.code && err.message) {
    return {
      code: err.code,
      message: mapSupabaseError(err.code, err.message),
    };
  }

  // Network error
  if (err.message?.includes("fetch") || err.message?.includes("network")) {
    return {
      code: "NETWORK",
      message: "Koneksi internet bermasalah. Coba lagi.",
    };
  }

  // Generic
  return {
    code: "UNKNOWN",
    message: err.message || "Terjadi kesalahan. Silakan coba lagi.",
  };
}

function mapSupabaseError(code, message) {
  const map = {
    23505: "Data sudah ada (duplikat).",
    23503: "Data terkait tidak ditemukan.",
    42501: "Kamu tidak memiliki akses untuk operasi ini.",
    PGRST116: "Data tidak ditemukan.",
    "auth/invalid-login": "Email atau password salah.",
    "auth/user-not-found": "Akun tidak ditemukan.",
    "auth/wrong-password": "Password salah.",
    "auth/email-already-in-use": "Email sudah terdaftar.",
    "auth/weak-password": "Password terlalu lemah (min. 6 karakter).",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
    "storage/object-not-found": "File tidak ditemukan.",
    "storage/file-size-exceeded": "Ukuran file terlalu besar.",
  };
  return map[code] || message;
}

/**
 * Wrapper async function dengan error handling terpusat.
 */
export async function withErrorHandling(fn, onError) {
  try {
    return await fn();
  } catch (err) {
    const normalized = normalizeError(err);
    console.error("❌", normalized.code, "-", normalized.message);
    onError?.(normalized);
    return null;
  }
}
