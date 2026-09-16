import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  X,
  Clock,
  MapPin,
  Laptop,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  StickyNote,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getKegiatanById,
  updateKegiatan,
  deleteKegiatan,
} from "../../services/kegiatanService";
import {
  uploadFoto,
  deleteFoto,
  getFotoUrl,
} from "../../services/storageService";
import { formatDateLong } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FileUpload from "../../components/ui/FileUpload";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loading from "../../components/ui/Loading";
import Card from "../../components/ui/Card";

function DetailRow({ icon: Icon, label, children, editMode }) {
  return (
    <div className="px-5 py-4 flex gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <div className="text-sm text-gray-800">{children}</div>
      </div>
    </div>
  );
}

export default function KegiatanDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fotoFile, setFotoFile] = useState(null);
  const [hapusFoto, setHapusFoto] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    load();
  }, [id, user]);

  async function load() {
    setLoading(true);
    try {
      const d = await getKegiatanById(user.id, id);
      if (!d) {
        setToast({ type: "error", message: "Kegiatan tidak ditemukan." });
        setTimeout(() => navigate("/kegiatan"), 800);
        return;
      }
      setData(d);
      setForm({
        tanggal: d.tanggal || "",
        jam_mulai: d.jam_mulai || "",
        jam_selesai: d.jam_selesai || "",
        tempat: d.tempat || "",
        kegiatan: d.kegiatan || "",
        software: d.software || "",
        pembelajaran: d.pembelajaran || "",
        kendala: d.kendala || "",
        solusi: d.solusi || "",
        catatan: d.catatan || "",
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

  async function handleSave() {
    if (!form.kegiatan.trim()) {
      setToast({ type: "error", message: "Kegiatan tidak boleh kosong." });
      return;
    }
    setSaving(true);
    try {
      let foto_url = data.foto_url;

      if (hapusFoto && data.foto_url) {
        await deleteFoto(data.foto_url);
        foto_url = null;
      }

      if (fotoFile) {
        if (data.foto_url) await deleteFoto(data.foto_url);
        foto_url = await uploadFoto(user.id, id, fotoFile);
      }

      const updated = await updateKegiatan(user.id, id, { ...form, foto_url });
      setData(updated);
      setEditMode(false);
      setFotoFile(null);
      setHapusFoto(false);
      setToast({ type: "success", message: "✓ Perubahan disimpan." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      if (data.foto_url) await deleteFoto(data.foto_url);
      await deleteKegiatan(user.id, id);
      setToast({ type: "success", message: "Kegiatan dihapus." });
      setTimeout(() => navigate("/kegiatan"), 700);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) return <Loading />;
  if (!data || !form) return null;

  const display = editMode ? form : data;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/kegiatan")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setForm({ ...data });
                  setFotoFile(null);
                  setHapusFoto(false);
                }}
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4 mr-1" /> Simpan
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditMode(true)}>
                <Edit2 className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Tanggal Kegiatan
        </p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">
          {formatDateLong(display.tanggal)}
        </h1>
      </div>

      {editMode ? (
        <FileUpload
          value={hapusFoto ? null : data.foto_url}
          onChange={(file) => {
            setFotoFile(file);
            setHapusFoto(false);
          }}
          onRemove={() => {
            setFotoFile(null);
            setHapusFoto(true);
          }}
        />
      ) : data.foto_url ? (
        <img
          src={getFotoUrl(data.foto_url)}
          alt="dokumentasi"
          className="w-full rounded-xl border border-gray-200"
        />
      ) : null}

      <Card className="divide-y divide-gray-100">
        <DetailRow icon={Clock} label="Waktu" editMode={editMode}>
          {editMode ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Input
                type="time"
                value={form.jam_mulai}
                onChange={(e) => set("jam_mulai", e.target.value)}
              />
              <Input
                type="time"
                value={form.jam_selesai}
                onChange={(e) => set("jam_selesai", e.target.value)}
              />
            </div>
          ) : (
            <span>
              {data.jam_mulai || "-"}{" "}
              {data.jam_selesai && `– ${data.jam_selesai}`}
            </span>
          )}
        </DetailRow>

        <DetailRow icon={MapPin} label="Tempat" editMode={editMode}>
          {editMode ? (
            <Input
              value={form.tempat}
              onChange={(e) => set("tempat", e.target.value)}
            />
          ) : (
            <span>{data.tempat || "-"}</span>
          )}
        </DetailRow>

        <DetailRow icon={BookOpen} label="Kegiatan" editMode={editMode}>
          {editMode ? (
            <textarea
              rows={3}
              value={form.kegiatan}
              onChange={(e) => set("kegiatan", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          ) : (
            <p className="whitespace-pre-wrap">{data.kegiatan}</p>
          )}
        </DetailRow>

        <DetailRow
          icon={Laptop}
          label="Software / Peralatan"
          editMode={editMode}
        >
          {editMode ? (
            <Input
              value={form.software}
              onChange={(e) => set("software", e.target.value)}
            />
          ) : (
            <span>{data.software || "-"}</span>
          )}
        </DetailRow>

        <DetailRow
          icon={Lightbulb}
          label="Hal yang dipelajari"
          editMode={editMode}
        >
          {editMode ? (
            <textarea
              rows={2}
              value={form.pembelajaran}
              onChange={(e) => set("pembelajaran", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          ) : (
            <p className="whitespace-pre-wrap">{data.pembelajaran || "-"}</p>
          )}
        </DetailRow>

        <DetailRow icon={AlertTriangle} label="Kendala" editMode={editMode}>
          {editMode ? (
            <textarea
              rows={2}
              value={form.kendala}
              onChange={(e) => set("kendala", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          ) : (
            <p className="whitespace-pre-wrap">{data.kendala || "-"}</p>
          )}
        </DetailRow>

        <DetailRow icon={Lightbulb} label="Solusi" editMode={editMode}>
          {editMode ? (
            <textarea
              rows={2}
              value={form.solusi}
              onChange={(e) => set("solusi", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          ) : (
            <p className="whitespace-pre-wrap">{data.solusi || "-"}</p>
          )}
        </DetailRow>

        <DetailRow
          icon={StickyNote}
          label="Catatan tambahan"
          editMode={editMode}
        >
          {editMode ? (
            <textarea
              rows={2}
              value={form.catatan}
              onChange={(e) => set("catatan", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          ) : (
            <p className="whitespace-pre-wrap">{data.catatan || "-"}</p>
          )}
        </DetailRow>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus kegiatan?"
        message="Catatan ini akan dihapus permanen beserta fotonya."
      />
    </div>
  );
}
