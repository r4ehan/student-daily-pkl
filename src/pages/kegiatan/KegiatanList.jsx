import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getKegiatanList,
  deleteKegiatan,
} from "../../services/kegiatanService";
import { deleteFoto, getFotoUrl } from "../../services/storageService";
import {
  groupBy,
  formatDateLong,
  formatDateRelative,
} from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loading from "../../components/ui/Loading";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function KegiatanList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) load();
  }, [user, search, filterMonth, filterYear]);

  async function load() {
    setLoading(true);
    try {
      const data = await getKegiatanList(user.id, {
        search,
        month: filterMonth,
        year: filterYear,
      });
      setList(data);
    } catch (err) {
      console.error("Gagal memuat kegiatan:", err);

      // Deteksi jika ini murni error koneksi
      if (
        err.message?.includes("fetch") ||
        err.message?.includes("NetworkError")
      ) {
        // Jangan hapus data lama, biarkan user tetap bisa melihat data terakhir
        // Jika pakai useToast dari Tahap 7:
        // toast.error('Koneksi terputus. Menampilkan data terakhir.');
      } else {
        // toast.error(err.message || 'Gagal memuat kegiatan');
      }
    } finally {
      // ⚠️ INI SANGAT PENTING: Pastikan loading selalu mati, sukses atau gagal
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const item = list.find((k) => k.id === confirmId);
      if (item?.foto_url) await deleteFoto(item.foto_url);
      await deleteKegiatan(user.id, confirmId);
      setList((prev) => prev.filter((k) => k.id !== confirmId));
      setToast({ type: "success", message: "Kegiatan berhasil dihapus." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menghapus" });
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  const grouped = useMemo(() => {
    const g = groupBy(list, (k) => k.tanggal);
    return Object.entries(g).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [list]);

  const years = useMemo(() => {
    const set = new Set(list.map((k) => new Date(k.tanggal).getFullYear()));
    const current = new Date().getFullYear();
    set.add(current);
    return Array.from(set).sort((a, b) => b - a);
  }, [list]);

  function resetFilter() {
    setSearch("");
    setFilterMonth("");
    setFilterYear("");
  }

  const hasFilter = search || filterMonth || filterYear;

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kegiatan PKL</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {list.length} kegiatan tercatat
          </p>
        </div>
        <Link to="/kegiatan/baru">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Catat
          </Button>
        </Link>
      </div>

      <Card className="p-3 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kegiatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">Semua bulan</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">Semua tahun</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {hasFilter && (
            <button
              onClick={resetFilter}
              className="text-xs text-primary hover:underline ml-auto"
            >
              Reset
            </button>
          )}
        </div>
      </Card>

      {loading ? (
        <Loading />
      ) : list.length === 0 ? (
        hasFilter ? (
          <EmptyState
            title="Tidak ada hasil"
            description="Coba ubah kata kunci atau filter tanggal."
            action={
              <Button variant="outline" onClick={resetFilter}>
                Reset Filter
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="Belum ada kegiatan"
            description="Catat kegiatan pertamamu agar nanti tidak lupa saat membuat laporan."
            action={
              <Link to="/kegiatan/baru">
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Catat Kegiatan
                </Button>
              </Link>
            }
          />
        )
      ) : (
        <div className="space-y-6">
          {grouped.map(([tanggal, items]) => (
            <div key={tanggal}>
              <div className="flex items-baseline gap-2 mb-2 sticky top-0 bg-gray-50 py-1 z-10">
                <h3 className="text-sm font-semibold text-gray-900">
                  {formatDateLong(tanggal)}
                </h3>
                <span className="text-xs text-gray-400">
                  {formatDateRelative(tanggal) !== formatDateLong(tanggal)
                    ? `· ${formatDateRelative(tanggal)}`
                    : ""}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((k) => (
                  <div
                    key={k.id}
                    onClick={() => navigate(`/kegiatan/${k.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all flex gap-3"
                  >
                    {k.foto_url && (
                      <img
                        src={getFotoUrl(k.foto_url)}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        {k.jam_mulai && <span>{k.jam_mulai}</span>}
                        {k.jam_mulai && k.jam_selesai && <span>–</span>}
                        {k.jam_selesai && <span>{k.jam_selesai}</span>}
                        {k.tempat && (
                          <>
                            <span>·</span>
                            <span className="truncate">{k.tempat}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {k.kegiatan}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus kegiatan?"
        message="Catatan ini akan dihapus permanen beserta fotonya."
      />
    </div>
  );
}
