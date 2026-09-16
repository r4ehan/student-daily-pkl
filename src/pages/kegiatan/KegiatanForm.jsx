import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createKegiatan, updateKegiatan } from "../../services/kegiatanService";
import { uploadFoto } from "../../services/storageService";
import { todayISO, nowTime } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FileUpload from "../../components/ui/FileUpload";
import Toast from "../../components/ui/Toast";
import Card from "../../components/ui/Card";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function KegiatanForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get("mode");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);

  // PERBAIKAN: useLocalStorage harus dipanggil DI DALAM komponen
  const [form, setForm] = useLocalStorage("draft-kegiatan", {
    tanggal: todayISO(),
    jam_mulai: nowTime(),
    jam_selesai: "",
    tempat: "",
    kegiatan: "",
    software: "",
    pembelajaran: "",
    kendala: "",
    solusi: "",
    catatan: "",
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.kegiatan.trim()) {
      setToast({ type: "error", message: "Isi kegiatan dulu ya." });
      return;
    }

    setLoading(true);
    try {
      // 1. Simpan data ke database
      const saved = await createKegiatan(user.id, form);

      // 2. Upload foto jika ada
      let foto_url = null;
      if (fotoFile) {
        try {
          foto_url = await uploadFoto(user.id, saved.id, fotoFile);
          await updateKegiatan(user.id, saved.id, { foto_url });
        } catch (err) {
          console.warn("Upload foto gagal:", err);
          // Tetap lanjut, karena foto opsional
        }
      }

      // PERBAIKAN: Hapus draft dari localStorage setelah berhasil simpan
      localStorage.removeItem("draft-kegiatan");

      setToast({ type: "success", message: "✓ Catatan berhasil disimpan." });
      setTimeout(() => navigate(`/kegiatan/${saved.id}`), 700);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setLoading(false);
    }
  }

  const isCepat = mode !== "lengkap";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isCepat ? "Catat Cepat" : "Catat Kegiatan"}
          </h1>
          <p className="text-xs text-gray-500">
            {isCepat
              ? "Tulis singkat saja, detail bisa dilengkapi nanti."
              : "Lengkapi semua detail kegiatan."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal"
              type="date"
              required
              value={form.tanggal}
              onChange={(e) => set("tanggal", e.target.value)}
            />
            <Input
              label="Jam Mulai"
              type="time"
              value={form.jam_mulai}
              onChange={(e) => set("jam_mulai", e.target.value)}
            />
          </div>

          {isCepat ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apa yang dilakukan? <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={form.kegiatan}
                onChange={(e) => set("kegiatan", e.target.value)}
                placeholder="Contoh: Membantu membuat desain undangan dan melakukan revisi."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.kegiatan}
                  onChange={(e) => set("kegiatan", e.target.value)}
                  placeholder="Deskripsi kegiatan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Jam Selesai"
                  type="time"
                  value={form.jam_selesai}
                  onChange={(e) => set("jam_selesai", e.target.value)}
                />
                <Input
                  label="Tempat"
                  value={form.tempat}
                  onChange={(e) => set("tempat", e.target.value)}
                  placeholder="Ruang desain"
                />
              </div>
              <Input
                label="Software / Peralatan"
                value={form.software}
                onChange={(e) => set("software", e.target.value)}
                placeholder="CorelDRAW, Printer, dll"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hal yang dipelajari
                </label>
                <textarea
                  rows={2}
                  value={form.pembelajaran}
                  onChange={(e) => set("pembelajaran", e.target.value)}
                  placeholder="Apa yang kamu pelajari hari ini?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kendala
                  </label>
                  <textarea
                    rows={2}
                    value={form.kendala}
                    onChange={(e) => set("kendala", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solusi
                  </label>
                  <textarea
                    rows={2}
                    value={form.solusi}
                    onChange={(e) => set("solusi", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan tambahan
                </label>
                <textarea
                  rows={2}
                  value={form.catatan}
                  onChange={(e) => set("catatan", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
            </>
          )}

          <FileUpload
            value={null} // Kita handle file baru di state fotoFile
            onChange={(file) => setFotoFile(file)}
            onRemove={() => setFotoFile(null)}
          />

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Opsional: hapus draft jika user membatalkan
                localStorage.removeItem("draft-kegiatan");
                navigate(-1);
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              <Save className="w-4 h-4 mr-1" /> Simpan
            </Button>
          </div>

          {isCepat && (
            <button
              type="button"
              onClick={() => navigate("/kegiatan/baru?mode=lengkap")}
              className="w-full text-center text-xs text-primary hover:underline pt-1"
            >
              Butuh field lebih lengkap? → Mode lengkap
            </button>
          )}
          {!isCepat && (
            <button
              type="button"
              onClick={() => navigate("/kegiatan/baru")}
              className="w-full text-center text-xs text-primary hover:underline pt-1"
            >
              ← Kembali ke mode cepat
            </button>
          )}
        </Card>
      </form>
    </div>
  );
}
