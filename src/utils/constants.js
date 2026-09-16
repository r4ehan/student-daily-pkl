export const KATEGORI_PEMASUKAN = [
  { value: "uang_saku", label: "Uang saku" },
  { value: "gaji_pkl", label: "Gaji / uang PKL" },
  { value: "bonus", label: "Bonus" },
  { value: "lainnya", label: "Pemasukan lain" },
];

export const KATEGORI_PENGELUARAN = [
  { value: "makan", label: "Makan" },
  { value: "transportasi", label: "Transportasi" },
  { value: "pulsa", label: "Pulsa / internet" },
  { value: "sekolah", label: "Sekolah" },
  { value: "pkl", label: "Keperluan PKL" },
  { value: "nongkrong", label: "Nongkrong" },
  { value: "belanja", label: "Belanja" },
  { value: "lainnya", label: "Lainnya" },
];

export function getKategoriLabel(jenis, value) {
  const list =
    jenis === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
  return list.find((k) => k.value === value)?.label || value;
}

export function getKategoriByJenis(jenis) {
  return jenis === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
}
