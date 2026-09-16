import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getTargetList,
  deleteTarget,
  addNominalToTarget,
} from "../../services/targetService";
import { formatRupiah, formatDateID } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loading from "../../components/ui/Loading";
import ConfettiEffect from "../../components/ui/ConfettiEffect";

export default function TargetList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("aktif"); // aktif | selesai
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [addModal, setAddModal] = useState(null); // { id, nominal }
  const [addLoading, setAddLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user) load();
  }, [user, tab]);

  async function load() {
    setLoading(true);
    try {
      const data = await getTargetList(user.id, {
        status: tab === "aktif" ? "aktif" : "selesai",
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
      await deleteTarget(user.id, confirmId);
      setList((prev) => prev.filter((t) => t.id !== confirmId));
      setToast({ type: "success", message: "Target dihapus." });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  async function handleAddNominal() {
    if (!addModal || !addModal.nominal) return;
    const nominal = Number(String(addModal.nominal).replace(/\D/g, ""));
    if (nominal <= 0) {
      setToast({ type: "error", message: "Nominal harus lebih dari 0." });
      return;
    }
    setAddLoading(true);
    try {
      const { data, justReached } = await addNominalToTarget(
        user.id,
        addModal.id,
        nominal,
      );
      setList((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      setAddModal(null);

      if (justReached) {
        setToast({ type: "success", message: "🎉 Target tercapai!" });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      } else {
        setToast({ type: "success", message: "✓ Saldo ditambahkan." });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setAddLoading(false);
    }
  }

  const filtered = list.filter((t) =>
    tab === "aktif" ? t.status === "aktif" : t.status === "selesai",
  );

  return (
    <div className="space-y-5">
      <ConfettiEffect trigger={showConfetti} duration={3000} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Target</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} target {tab}
          </p>
        </div>
        <Link to="/target/baru">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Target Baru
          </Button>
        </Link>
      </div>

      {/* Tab */}
      <div className="flex gap-1 border-b border-gray-100">
        {[
          { v: "aktif", l: "Aktif" },
          { v: "selesai", l: "Selesai" },
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
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            tab === "aktif"
              ? "Belum ada target aktif"
              : "Belum ada target selesai"
          }
          description="Buat target tabungan pertamamu untuk semangat menabung."
          action={
            tab === "aktif" && (
              <Link to="/target/baru">
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Buat Target
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((t) => {
            const persen = Math.min(
              100,
              Math.round(
                (Number(t.nominal_terkumpul) / Number(t.target_nominal)) * 100,
              ),
            );
            const isReached =
              Number(t.nominal_terkumpul) >= Number(t.target_nominal);

            return (
              <Card key={t.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isReached ? "bg-green-100" : "bg-primary/10"
                      }`}
                    >
                      {isReached ? (
                        <Trophy className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-primary font-bold text-sm">
                          🎯
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {t.nama_target}
                      </h3>
                      {t.deadline && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Deadline: {formatDateID(t.deadline)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatRupiah(t.nominal_terkumpul)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRupiah(t.target_nominal)} · {persen}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isReached ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </div>

                {t.catatan && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {t.catatan}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  {!isReached && (
                    <Button
                      size="sm"
                      onClick={() => setAddModal({ id: t.id, nominal: "" })}
                      className="flex-1"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" /> Tambah Saldo
                    </Button>
                  )}
                  <Link to={`/target/edit/${t.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmId(t.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Tambah Nominal */}
      <Modal
        open={!!addModal}
        onClose={() => setAddModal(null)}
        title="Tambah Saldo"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nominal yang ditambahkan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                value={
                  addModal?.nominal
                    ? Number(
                        String(addModal.nominal).replace(/\D/g, "") || 0,
                      ).toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) =>
                  setAddModal((m) => ({
                    ...m,
                    nominal: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="0"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[50000, 100000, 200000, 500000].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  setAddModal((m) => ({ ...m, nominal: String(n) }))
                }
                className="py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {n / 1000}rb
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAddModal(null)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleAddNominal}
              loading={addLoading}
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" /> Simpan
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus target?"
        message="Target ini akan dihapus permanen."
      />
    </div>
  );
}
