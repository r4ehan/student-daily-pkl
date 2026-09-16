import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import {
  getRingkasanKeuangan,
  getTransaksiList,
  getGrafikBulanan,
  deleteTransaksi,
} from "../../services/transaksiService";
import { getKategoriLabel } from "../../utils/constants";
import { formatRupiah, formatDateID } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PeriodFilter from "../../components/ui/PeriodFilter";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loading from "../../components/ui/Loading";

export default function KeuanganDashboard() {
  const { user } = useAuth();

  const [period, setPeriod] = useState({
    preset: "month",
    startDate: null,
    endDate: null,
  });
  const [ringkasan, setRingkasan] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    saldo: 0,
    count: 0,
  });
  const [list, setList] = useState([]);
  const [grafik, setGrafik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState("semua"); // semua | pemasukan | pengeluaran

  useEffect(() => {
    if (user) loadAll();
  }, [user, period]);

  async function loadAll() {
    setLoading(true);
    try {
      const [rk, ls, gr] = await Promise.all([
        getRingkasanKeuangan(user.id, {
          startDate: period.startDate,
          endDate: period.endDate,
        }),
        getTransaksiList(user.id, {
          startDate: period.startDate,
          endDate: period.endDate,
        }),
        getGrafikBulanan(user.id),
      ]);
      setRingkasan(rk);
      setList(ls);
      setGrafik(gr);
    } catch (err) {
      console.error("Gagal memuat keuangan:", err);
      // Jika pakai useToast: toast.error('Gagal memuat data keuangan.');
    } finally {
      setLoading(false); // ⚠️ Wajib ada
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteTransaksi(user.id, confirmId);
      setList((prev) => prev.filter((t) => t.id !== confirmId));
      // Reload ringkasan
      const rk = await getRingkasanKeuangan(user.id, {
        startDate: period.startDate,
        endDate: period.endDate,
      });
      setRingkasan(rk);
      setToast({ type: "success", message: "Transaksi dihapus." });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  const filteredList = useMemo(() => {
    if (tab === "semua") return list;
    return list.filter((t) => t.jenis === tab);
  }, [list, tab]);

  const periodLabel = useMemo(() => {
    if (period.preset === "all") return "Semua waktu";
    if (period.preset === "custom") {
      return `${formatDateID(period.startDate)} — ${formatDateID(period.endDate)}`;
    }
    return {
      today: "Hari ini",
      week: "Minggu ini",
      month: "Bulan ini",
    }[period.preset];
  }, [period]);

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keuangan</h1>
          <p className="text-sm text-gray-500 mt-0.5">{periodLabel}</p>
        </div>
        <Link to="/keuangan/baru">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </Link>
      </div>

      {/* Period Filter */}
      <Card className="p-3">
        <PeriodFilter value={period} onChange={setPeriod} />
      </Card>

      {/* Ringkasan */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryCard
              label="Pemasukan"
              value={formatRupiah(ringkasan.pemasukan)}
              icon={TrendingUp}
              color="green"
            />
            <SummaryCard
              label="Pengeluaran"
              value={formatRupiah(ringkasan.pengeluaran)}
              icon={TrendingDown}
              color="red"
            />
            <SummaryCard
              label="Saldo"
              value={formatRupiah(ringkasan.saldo)}
              icon={Wallet}
              color="blue"
              highlight
            />
          </div>

          {/* Grafik */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              12 Bulan Terakhir
            </h3>
            {grafik.every((g) => g.pemasukan === 0 && g.pengeluaran === 0) ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Belum ada data untuk ditampilkan.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={grafik}
                    margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="bulan"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickFormatter={(v) => {
                        if (v >= 1000000)
                          return `${(v / 1000000).toFixed(1)}jt`;
                        if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
                        return v;
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                      formatter={(value) => formatRupiah(value)}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="pemasukan"
                      name="Pemasukan"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pengeluaran"
                      name="Pengeluaran"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Tab + List */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Transaksi</h3>
              <Link
                to="/keuangan/riwayat"
                className="text-xs text-primary hover:underline"
              >
                Lihat semua
              </Link>
            </div>

            <div className="flex gap-1 mb-4 border-b border-gray-100">
              {[
                { v: "semua", l: "Semua" },
                { v: "pemasukan", l: "Masuk" },
                { v: "pengeluaran", l: "Keluar" },
              ].map((t) => (
                <button
                  key={t.v}
                  onClick={() => setTab(t.v)}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    tab === t.v
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {filteredList.length === 0 ? (
              <EmptyState
                title="Belum ada transaksi"
                description="Catat pemasukan atau pengeluaran pertamamu."
                action={
                  <Link to="/keuangan/baru">
                    <Button>
                      <Plus className="w-4 h-4 mr-1" /> Tambah Transaksi
                    </Button>
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredList.slice(0, 10).map((t) => (
                  <li key={t.id} className="py-3 flex items-center gap-3 group">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        t.jenis === "pemasukan" ? "bg-green-100" : "bg-red-100"
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
                      <p className="text-xs text-gray-500">
                        {formatDateID(t.tanggal)}
                        {t.catatan && ` · ${t.catatan}`}
                      </p>
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
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end mt-0.5">
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
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
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

function SummaryCard({ label, value, icon: Icon, color, highlight }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };
  return (
    <Card className={`p-4 ${highlight ? "ring-1 ring-primary/20" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p
        className={`font-bold ${highlight ? "text-xl text-gray-900" : "text-lg text-gray-800"}`}
      >
        {value}
      </p>
    </Card>
  );
}
