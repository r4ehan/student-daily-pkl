import { useEffect, useMemo, useState } from "react";
import { Plus, Check, Trash2, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getRencanaList,
  createRencana,
  toggleRencana,
  deleteRencana,
} from "../../services/rencanaService";
import {
  todayISO,
  formatDateRelative,
  groupBy,
  formatDateLong,
} from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import Loading from "../../components/ui/Loading";
import ConfettiEffect from "../../components/ui/ConfettiEffect";

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function RencanaList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("aktif"); // aktif | selesai | semua
  const [toast, setToast] = useState(null);
  const [newIsi, setNewIsi] = useState("");
  const [newTanggal, setNewTanggal] = useState(todayISO());
  const [adding, setAdding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user) load();
  }, [user, tab]);

  async function load() {
    setLoading(true);
    try {
      let data;
      if (tab === "aktif")
        data = await getRencanaList(user.id, { selesai: false });
      else if (tab === "selesai")
        data = await getRencanaList(user.id, { selesai: true });
      else data = await getRencanaList(user.id);
      setList(data);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newIsi.trim()) return;
    setAdding(true);
    try {
      const created = await createRencana(user.id, {
        isi: newIsi.trim(),
        tanggal: newTanggal,
        selesai: false,
      });
      setList((prev) => [created, ...prev]);
      setNewIsi("");
      setToast({ type: "success", message: "✓ Rencana ditambahkan." });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(item) {
    try {
      const updated = await toggleRencana(user.id, item.id, !item.selesai);
      setList((prev) => prev.map((r) => (r.id === item.id ? updated : r)));

      // Jika baru saja diselesaikan (dari false ke true)
      if (updated.selesai && !item.selesai) {
        setToast({ type: "success", message: "🎉 Rencana selesai!" });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRencana(user.id, id);
      setList((prev) => prev.filter((r) => r.id !== id));
      setToast({ type: "success", message: "Rencana dihapus." });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  }

  const grouped = useMemo(() => {
    const g = groupBy(list, (r) => r.tanggal);
    return Object.entries(g).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [list]);

  return (
    <div className="space-y-5">
      <ConfettiEffect trigger={showConfetti} duration={2500} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rencana</h1>
        <p className="text-sm text-gray-500 mt-0.5">{list.length} rencana</p>
      </div>

      {/* Form tambah cepat */}
      <Card className="p-4">
        <form onSubmit={handleAdd} className="space-y-3">
          <textarea
            rows={2}
            value={newIsi}
            onChange={(e) => setNewIsi(e.target.value)}
            placeholder="Apa yang ingin kamu lakukan?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={newTanggal}
                onChange={(e) => setNewTanggal(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setNewTanggal(todayISO())}
                className="text-xs text-primary hover:underline px-2 py-1"
              >
                Hari ini
              </button>
              <button
                type="button"
                onClick={() => setNewTanggal(tomorrowISO())}
                className="text-xs text-primary hover:underline px-2 py-1"
              >
                Besok
              </button>
            </div>
            <Button
              type="submit"
              loading={adding}
              size="sm"
              disabled={!newIsi.trim()}
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah
            </Button>
          </div>
        </form>
      </Card>

      {/* Tab */}
      <div className="flex gap-1 border-b border-gray-100">
        {[
          { v: "aktif", l: "Aktif" },
          { v: "selesai", l: "Selesai" },
          { v: "semua", l: "Semua" },
        ].map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.v
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : list.length === 0 ? (
        <EmptyState
          title={
            tab === "aktif"
              ? "Belum ada rencana aktif"
              : tab === "selesai"
                ? "Belum ada rencana selesai"
                : "Belum ada rencana"
          }
          description="Tulis rencana di atas untuk mulai mengatur harimu."
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(([tanggal, items]) => (
            <div key={tanggal}>
              <div className="flex items-baseline gap-2 mb-2 sticky top-0 bg-gray-50 py-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {formatDateRelative(tanggal)}
                </h3>
                <span className="text-xs text-gray-400">
                  {formatDateLong(tanggal)}
                </span>
              </div>
              <Card className="divide-y divide-gray-100">
                {items.map((r) => (
                  <div
                    key={r.id}
                    className="px-4 py-3 flex items-start gap-3 group"
                  >
                    <button
                      onClick={() => handleToggle(r)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        r.selesai
                          ? "bg-primary border-primary"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {r.selesai && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <p
                      className={`flex-1 text-sm ${r.selesai ? "text-gray-400 line-through" : "text-gray-800"}`}
                    >
                      {r.isi}
                    </p>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
