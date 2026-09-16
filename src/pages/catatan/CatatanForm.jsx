import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  createNote,
  updateNote,
  getNoteById,
  deleteNote,
} from "../../services/notesService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Toast from "../../components/ui/Toast";
import Loading from "../../components/ui/Loading";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function CatatanForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({ judul: "", isi: "" });

  useEffect(() => {
    if (isEdit) load();
    // eslint-disable-next-line
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const data = await getNoteById(user.id, id);
      if (!data) {
        setToast({ type: "error", message: "Catatan tidak ditemukan." });
        setTimeout(() => navigate("/catatan"), 800);
        return;
      }
      setForm({ judul: data.judul || "", isi: data.isi || "" });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.judul.trim() && !form.isi.trim()) {
      setToast({ type: "error", message: "Isi judul atau catatan dulu." });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        judul: form.judul.trim() || "Tanpa judul",
        isi: form.isi,
      };
      if (isEdit) await updateNote(user.id, id, payload);
      else await createNote(user.id, payload);

      setToast({
        type: "success",
        message: isEdit ? "✓ Catatan diperbarui." : "✓ Catatan disimpan.",
      });
      setTimeout(() => navigate("/catatan"), 700);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteNote(user.id, id);
      setToast({ type: "success", message: "Catatan dihapus." });
      setTimeout(() => navigate("/catatan"), 700);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {isEdit && (
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(true)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Hapus
            </Button>
          )}
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4 mr-1" /> Simpan
          </Button>
        </div>
      </div>

      <Card className="p-5 space-y-4">
        <Input
          label="Judul"
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          placeholder="Judul catatan..."
          className="text-lg font-semibold"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Isi
          </label>
          <textarea
            rows={12}
            value={form.isi}
            onChange={(e) => setForm({ ...form, isi: e.target.value })}
            placeholder="Tulis catatanmu di sini..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none leading-relaxed"
          />
        </div>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus catatan?"
        message="Catatan ini akan dihapus permanen."
      />
    </div>
  );
}
