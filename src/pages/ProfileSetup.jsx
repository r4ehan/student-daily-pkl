import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { upsertProfile } from "../services/profileService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/ui/Toast";
import Card from "../components/ui/Card";

export default function ProfileSetup() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    jurusan: "",
    sekolah: "",
    tempat_pkl: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  function handleChange(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama || !form.sekolah || !form.tempat_pkl) {
      setToast({
        type: "error",
        message: "Nama, sekolah, dan tempat PKL wajib diisi.",
      });
      return;
    }
    setLoading(true);
    try {
      await upsertProfile(user.id, form);
      refreshProfile();
      setToast({ type: "success", message: "Profil berhasil disimpan." });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lengkapi Profil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Data ini akan muncul di dashboard dan laporan PKL-mu.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={form.nama}
            onChange={(e) => handleChange("nama", e.target.value)}
            placeholder="xxxx"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kelas"
              value={form.kelas}
              onChange={(e) => handleChange("kelas", e.target.value)}
              placeholder="xxxx"
            />
            <Input
              label="Jurusan"
              value={form.jurusan}
              onChange={(e) => handleChange("jurusan", e.target.value)}
              placeholder="xxxx"
            />
          </div>
          <Input
            label="Sekolah"
            value={form.sekolah}
            onChange={(e) => handleChange("sekolah", e.target.value)}
            placeholder="xxxx"
          />
          <Input
            label="Tempat PKL"
            value={form.tempat_pkl}
            onChange={(e) => handleChange("tempat_pkl", e.target.value)}
            placeholder="xxxx"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={form.tanggal_mulai}
              onChange={(e) => handleChange("tanggal_mulai", e.target.value)}
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={form.tanggal_selesai}
              onChange={(e) => handleChange("tanggal_selesai", e.target.value)}
            />
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Simpan Profil
          </Button>
        </form>
      </Card>
    </div>
  );
}
