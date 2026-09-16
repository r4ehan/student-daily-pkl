export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return password && password.length >= 6;
}

export function isValidNominal(n) {
  const num = Number(n);
  return !isNaN(num) && num > 0 && num <= 1000000000;
}

export function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export function sanitizeText(text) {
  if (!text) return "";
  return String(text).trim().replace(/\s+/g, " ");
}

export function validateProfile(form) {
  const errors = {};
  if (!form.nama?.trim()) errors.nama = "Nama wajib diisi";
  if (!form.sekolah?.trim()) errors.sekolah = "Sekolah wajib diisi";
  if (!form.tempat_pkl?.trim()) errors.tempat_pkl = "Tempat PKL wajib diisi";
  if (form.tanggal_mulai && form.tanggal_selesai) {
    if (new Date(form.tanggal_selesai) < new Date(form.tanggal_mulai)) {
      errors.tanggal_selesai = "Tanggal selesai harus setelah tanggal mulai";
    }
  }
  return errors;
}

export function validateKegiatan(form) {
  const errors = {};
  if (!form.tanggal) errors.tanggal = "Tanggal wajib diisi";
  if (!form.kegiatan?.trim()) errors.kegiatan = "Kegiatan wajib diisi";
  if (form.jam_mulai && form.jam_selesai && form.jam_selesai < form.jam_mulai) {
    errors.jam_selesai = "Jam selesai harus setelah jam mulai";
  }
  return errors;
}

export function validateTransaksi(form) {
  const errors = {};
  if (!form.tanggal) errors.tanggal = "Tanggal wajib diisi";
  if (!form.jenis) errors.jenis = "Jenis wajib dipilih";
  if (!form.kategori) errors.kategori = "Kategori wajib dipilih";
  if (!isValidNominal(form.nominal)) errors.nominal = "Nominal tidak valid";
  return errors;
}
