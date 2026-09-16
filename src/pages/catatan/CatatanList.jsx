import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, StickyNote, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getNotesList, deleteNote } from "../../services/notesService";
import { formatDateID, truncate } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loading from "../../components/ui/Loading";

export default function CatatanList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await getNotesList(user.id, { search });
      setList(data);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (user) load();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteNote(user.id, confirmId);
      setList((prev) => prev.filter((n) => n.id !== confirmId));
      setToast({ type: "success", message: "Catatan dihapus." });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (n) =>
        n.judul?.toLowerCase().includes(q) || n.isi?.toLowerCase().includes(q),
    );
  }, [list, search]);

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catatan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} catatan
          </p>
        </div>
        <Link to="/catatan/baru">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Catatan Baru
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul atau isi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Tidak ada hasil" : "Belum ada catatan"}
          description={
            search
              ? "Coba kata kunci lain."
              : "Simpan ide, tugas, atau hal penting yang tidak ingin lupa."
          }
          action={
            !search && (
              <Link to="/catatan/baru">
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Buat Catatan
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((n) => (
            <Link
              key={n.id}
              to={`/catatan/edit/${n.id}`}
              className="block group"
            >
              <Card className="p-4 hover:border-primary/50 hover:shadow-sm transition-all h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <StickyNote className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {n.judul || "Tanpa judul"}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmId(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3 whitespace-pre-wrap">
                  {n.isi || " "}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDateID(n.updated_at || n.created_at)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus catatan?"
        message="Catatan ini akan dihapus permanen."
      />
    </div>
  );
}
