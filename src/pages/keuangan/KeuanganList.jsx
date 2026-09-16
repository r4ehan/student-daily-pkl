import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getTransaksiList,
  deleteTransaksi,
} from "../../services/transaksiService";
import { getKategoriLabel } from "../../utils/constants";
import { formatRupiah, formatDateID, groupBy } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loading from "../../components/ui/Loading";

export default function KeuanganList() {
  const { user } = useAuth();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) load();
  }, [user, jenis]);

  async function load() {
    setLoading(true);
    try {
      const data = await getTransaksiList(user.id, {
        jenis: jenis || undefined,
      });
      setList(data);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteTransaksi(user.id, confirmId);
      setList((prev) => prev.filter((t) => t.id !== confirmId));
      setToast({ type: "success", message: "Transaksi dihapus." });
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
      (t) =>
        t.catatan?.toLowerCase().includes(q) ||
        getKategoriLabel(t.jenis, t.kategori).toLowerCase().includes(q),
    );
  }, [list, search]);

  const grouped = useMemo(() => {
    return Object.entries(groupBy(filtered, (t) => t.tanggal)).sort(
      ([a], [b]) => (a < b ? 1 : -1),
    );
  }, [filtered]);

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} transaksi
          </p>
        </div>
        <Link to="/keuangan/baru">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card className="p-3 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari catatan atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">Semua jenis</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-primary hover:underline ml-auto"
            >
              Reset
            </button>
          )}
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada transaksi"
          description={
            search
              ? "Coba ubah kata kunci pencarian."
              : "Mulai catat transaksi pertamamu."
          }
          action={
            !search && (
              <Link to="/keuangan/baru">
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Tambah Transaksi
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(([tanggal, items]) => {
            const totalIn = items
              .filter((t) => t.jenis === "pemasukan")
              .reduce((a, t) => a + Number(t.nominal), 0);
            const totalOut = items
              .filter((t) => t.jenis === "pengeluaran")
              .reduce((a, t) => a + Number(t.nominal), 0);

            return (
              <div key={tanggal}>
                <div className="flex items-baseline justify-between mb-2 sticky top-0 bg-gray-50 py-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {formatDateID(tanggal)}
                  </h3>
                  <div className="flex gap-3 text-xs">
                    {totalIn > 0 && (
                      <span className="text-green-600">
                        +{formatRupiah(totalIn)}
                      </span>
                    )}
                    {totalOut > 0 && (
                      <span className="text-red-600">
                        -{formatRupiah(totalOut)}
                      </span>
                    )}
                  </div>
                </div>
                <Card className="divide-y divide-gray-100">
                  {items.map((t) => (
                    <div
                      key={t.id}
                      className="px-4 py-3 flex items-center gap-3 group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          t.jenis === "pemasukan"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {t.jenis === "pemasukan" ? (
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {getKategoriLabel(t.jenis, t.kategori)}
                        </p>
                        {t.catatan && (
                          <p className="text-xs text-gray-500 truncate">
                            {t.catatan}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm font-semibold ${
                            t.jenis === "pemasukan"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {t.jenis === "pemasukan" ? "+" : "-"}
                          {formatRupiah(t.nominal)}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end mt-0.5">
                          <Link
                            to={`/keuangan/edit/${t.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setConfirmId(t.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus transaksi?"
        message="Transaksi ini akan dihapus permanen."
      />
    </div>
  );
}
