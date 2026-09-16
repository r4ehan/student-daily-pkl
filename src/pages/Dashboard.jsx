import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Wallet,
  Target,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import { formatRupiah } from "../utils/helpers";
import NotificationPermission from "../components/ui/NotificationPermission";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

function formatDateID(date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { user, profile, loading, isProfileComplete } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    todayKegiatan: null,
    lastKegiatan: [],
    activeTarget: null,
    saldo: 0,
    hariPkl: 0,
    rencana: [],
  });
  const [loadingData, setLoadingData] = useState(true);

  // Redirect ke profil setup jika belum lengkap
  useEffect(() => {
    if (!loading && !isProfileComplete) {
      navigate("/profil-setup", { replace: true });
    }
  }, [loading, isProfileComplete, navigate]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    setLoadingData(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // 1. Cek kegiatan hari ini
      const { data: tk } = await supabase
        .from("kegiatan")
        .select("id")
        .eq("user_id", user.id)
        .eq("tanggal", today)
        .limit(1);

      // 2. Ambil 5 kegiatan terakhir
      const { data: lk } = await supabase
        .from("kegiatan")
        .select("id, tanggal, kegiatan")
        .eq("user_id", user.id)
        .order("tanggal", { ascending: false })
        .limit(5);

      // 3. Hitung total hari PKL unik
      const { data: allDates } = await supabase
        .from("kegiatan")
        .select("tanggal")
        .eq("user_id", user.id);
      const uniqueDays = new Set(allDates?.map((k) => k.tanggal) || []).size;

      // 4. Hitung saldo keuangan
      const { data: trx } = await supabase
        .from("transaksi")
        .select("jenis, nominal")
        .eq("user_id", user.id);
      const saldo = (trx || []).reduce(
        (acc, t) => acc + (t.jenis === "pemasukan" ? t.nominal : -t.nominal),
        0,
      );

      // 5. Ambil target aktif terbaru
      const { data: tgt } = await supabase
        .from("target")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "aktif")
        .order("created_at", { ascending: false })
        .limit(1);

      // 6. Ambil rencana yang belum selesai (hari ini & masa depan)
      const { data: rnc } = await supabase
        .from("rencana")
        .select("*")
        .eq("user_id", user.id)
        .eq("selesai", false)
        .gte("tanggal", today)
        .order("tanggal", { ascending: true })
        .limit(5);

      // Update state dengan data yang didapat
      setData({
        todayKegiatan: tk?.[0] || null,
        lastKegiatan: lk || [],
        activeTarget: tgt?.[0] || null,
        saldo,
        hariPkl: uniqueDays,
        rencana: rnc || [],
      });
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
      // Biarkan data lama tetap tampil jika offline, jangan di-reset
    } finally {
      // ⚠️ SANGAT PENTING: Pastikan loading selalu mati, sukses atau gagal
      setLoadingData(false);
    }
  }

  if (loading || loadingData) return <Loading text="Memuat dashboard..." />;

  const nama = profile?.nama?.split(" ")[0] || "Teman";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getGreeting()}, {nama}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formatDateID(new Date())}
        </p>
      </div>

      {/* ✅ KOMPONEN NOTIFIKASI */}
      <NotificationPermission />

      {/* Status hari ini */}
      <Card className="p-5">
        {data.todayKegiatan ? (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Kegiatan hari ini sudah dicatat ✓
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Terus semangat mencatat ya!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Belum ada kegiatan hari ini
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Catat sekarang supaya tidak lupa nanti.
              </p>
              <Link to="/kegiatan/baru">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Catat Sekarang
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Hari PKL" value={data.hariPkl} />
        <SummaryCard label="Kegiatan" value={data.lastKegiatan.length} />
        <SummaryCard label="Saldo" value={formatRupiah(data.saldo)} small />
        <SummaryCard label="Target Aktif" value={data.activeTarget ? 1 : 0} />
      </div>

      {/* Quick Action */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <QuickLink
            to="/kegiatan/baru"
            icon={ClipboardList}
            label="Catat Cepat"
          />
          <QuickLink to="/keuangan" icon={Wallet} label="Keuangan" />
          <QuickLink to="/target" icon={Target} label="Target" />
          <QuickLink to="/rencana" icon={ClipboardList} label="Rencana" />
        </div>
      </div>

      {/* Kegiatan terakhir */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Kegiatan Terakhir
          </h3>
          <Link to="/kegiatan" className="text-xs text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        {data.lastKegiatan.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada kegiatan dicatat.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.lastKegiatan.map((k) => (
              <li key={k.id} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-gray-400 w-20 shrink-0">
                  {new Date(k.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                  {k.kegiatan}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Target aktif */}
      {data.activeTarget && (
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Target Aktif
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {data.activeTarget.nama_target}
          </p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (data.activeTarget.nominal_terkumpul /
                    data.activeTarget.target_nominal) *
                    100,
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {formatRupiah(data.activeTarget.nominal_terkumpul)} /{" "}
            {formatRupiah(data.activeTarget.target_nominal)}
          </p>
        </Card>
      )}

      {/* Rencana */}
      {data.rencana.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Rencana Berikutnya
          </h3>
          <ul className="space-y-2">
            {data.rencana.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-sm">
                <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
                    {r.isi}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(r.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function SummaryCard({ label, value, small }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`font-semibold text-gray-900 dark:text-gray-100 mt-1 ${
          small ? "text-base" : "text-2xl"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
    >
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <span className="font-medium truncate">{label}</span>
    </Link>
  );
}
