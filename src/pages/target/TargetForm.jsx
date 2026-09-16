import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  createTarget,
  updateTarget,
  getTargetById,
} from "../../services/targetService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Toast from "../../components/ui/Toast";
import Loading from "../../components/ui/Loading";

export default function TargetForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    nama_target: "",
    target_nominal: "",
    nominal_terkumpul: "0",
    deadline: "",
    catatan: "",
  });

  useEffect(() => {
    if (isEdit) load();
    // eslint-disable-next-line
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const data = await getTargetById(user.id, id);
      if (!data) {
        setToast({ type: "error", message: "Target tidak ditemukan." });
        setTimeout(() => navigate("/target"), 800);
        return;
      }
      setForm({
        nama_target: data.nama_target || "",
        target_nominal: String(data.target_nominal || ""),
        nominal_terkumpul: String(data.nominal_terkumpul || "0"),
        deadline: data.deadline || "",
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
    const targetNom = Number(String(form.target_nominal).replace(/\D/g, ""));
    const terkumpul = Number(
      String(form.nominal_terkumpul).replace(/\D/g, "") || "0",
    );

    if (!form.nama_target.trim()) {
      setToast({ type: "error", message: "Nama target wajib diisi." });
      return;
    }
    if (!targetNom || targetNom <= 0) {
      setToast({
        type: "error",
        message: "Target nominal harus lebih dari 0.",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nama_target: form.nama_target.trim(),
        target_nominal: targetNom,
        nominal_terkumpul: terkumpul,
        deadline: form.deadline || null,
        catatan: form.catatan.trim() || null,
        status: terkumpul >= targetNom ? "selesai" : "aktif",
      };

      if (isEdit) await updateTarget(user.id, id, payload);
      else await createTarget(user.id, payload);

      setToast({
        type: "success",
        message: isEdit ? "✓ Target diperbarui." : "✓ Target dibuat.",
      });
      setTimeout(() => navigate("/target"), 700);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-xl mx-auto space-y-5">
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
            {isEdit ? "Edit Target" : "Target Baru"}
          </h1>
          <p className="text-xs text-gray-500">
            Tentukan target tabungan yang ingin dicapai.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-5 space-y-4">
          <Input
            label="Nama Target"
            required
            value={form.nama_target}
            onChange={(e) => set("nama_target", e.target.value)}
            placeholder="Contoh: Membeli Headset"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Nominal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={
                  form.target_nominal
                    ? Number(
                        String(form.target_nominal).replace(/\D/g, "") || 0,
                      ).toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) =>
                  set("target_nominal", e.target.value.replace(/\D/g, ""))
                }
                placeholder="500.000"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo Awal{" "}
                <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    form.nominal_terkumpul
                      ? Number(
                          String(form.nominal_terkumpul).replace(/\D/g, "") ||
                            0,
                        ).toLocaleString("id-ID")
                      : ""
                  }
                  onChange={(e) =>
                    set("nominal_terkumpul", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="0"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>
          )}

          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={form.catatan}
              onChange={(e) => set("catatan", e.target.value)}
              placeholder="Untuk apa target ini?"
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
