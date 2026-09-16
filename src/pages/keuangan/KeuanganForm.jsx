import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  createTransaksi,
  updateTransaksi,
  getTransaksiById,
} from "../../services/transaksiService";
import { getKategoriByJenis } from "../../utils/constants";
import { todayISO } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Toast from "../../components/ui/Toast";
import Loading from "../../components/ui/Loading";

export default function KeuanganForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const isEdit = !!id;

  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    tanggal: todayISO(),
    jenis: params.get("jenis") === "pengeluaran" ? "pengeluaran" : "pemasukan",
    kategori: "",
    nominal: "",
    catatan: "",
  });

  useEffect(() => {
    if (isEdit) load();
    // eslint-disable-next-line
  }, [id]);

  // Reset kategori saat ganti jenis
  useEffect(() => {
    setForm((f) => ({ ...f, kategori: "" }));
  }, [form.jenis]);

  async function load() {
    setLoading(true);
    try {
      const data = await getTransaksiById(user.id, id);
      if (!data) {
        setToast({ type: "error", message: "Transaksi tidak ditemukan." });
        setTimeout(() => navigate("/keuangan"), 800);
        return;
      }
      setForm({
        tanggal: data.tanggal,
        jenis: data.jenis,
        kategori: data.kategori,
        nominal: String(data.nominal),
        catatan: data.catatan || "",
      });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nominal = Number(String(form.nominal).replace(/\D/g, ""));
    if (!nominal || nominal <= 0) {
      setToast({ type: "error", message: "Nominal harus lebih dari 0." });
      return;
    }
    if (!form.kategori) {
      setToast({ type: "error", message: "Pilih kategori dulu." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tanggal: form.tanggal,
        jenis: form.jenis,
        kategori: form.kategori,
        nominal,
        catatan: form.catatan.trim() || null,
      };

      if (isEdit) await updateTransaksi(user.id, id, payload);
      else await createTransaksi(user.id, payload);

      setToast({
        type: "success",
        message: isEdit
          ? "✓ Transaksi diperbarui."
          : "✓ Transaksi ditambahkan.",
      });
      setTimeout(() => navigate("/keuangan"), 700);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  }

  const kategoriList = getKategoriByJenis(form.jenis);
  const nominalDisplay = Number(
    String(form.nominal).replace(/\D/g, "") || 0,
  ).toLocaleString("id-ID");

  if (loading) return <Loading />;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Transaksi" : "Tambah Transaksi"}
          </h1>
          <p className="text-xs text-gray-500">
            Catat pemasukan atau pengeluaranmu.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-5 space-y-4">
          {/* Jenis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => set("jenis", "pemasukan")}
                className={`py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                  form.jenis === "pemasukan"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ↓ Pemasukan
              </button>
              <button
                type="button"
                onClick={() => set("jenis", "pengeluaran")}
                className={`py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                  form.jenis === "pengeluaran"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ↑ Pengeluaran
              </button>
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nominal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={nominalDisplay}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  set("nominal", raw);
                }}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {kategoriList.map((k) => (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => set("kategori", k.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    form.kategori === k.value
                      ? form.jenis === "pemasukan"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Tanggal"
            type="date"
            required
            value={form.tanggal}
            onChange={(e) => set("tanggal", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows={2}
              value={form.catatan}
              onChange={(e) => set("catatan", e.target.value)}
              placeholder="Contoh: Beli makan siang di kantin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              <Save className="w-4 h-4 mr-1" /> Simpan
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
