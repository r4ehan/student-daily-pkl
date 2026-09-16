import { getFotoUrl } from "../../services/storageService";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Wallet,
  Target,
  StickyNote,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAktivitasBulan,
  getAktivitasTanggal,
} from "../../services/calendarService";
import { getKategoriLabel } from "../../utils/constants";
import { formatRupiah, formatDateLong } from "../../utils/helpers";
import Calendar from "../../components/ui/Calendar";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import Toast from "../../components/ui/Toast";

export default function Kalender() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [markers, setMarkers] = useState({});
  const [dayDetail, setDayDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [toast, setToast] = useState(null);

  // Load markers untuk bulan yang ditampilkan
  useEffect(() => {
    if (!user) return;
    loadMarkers();
    // eslint-disable-next-line
  }, [user, currentMonth]);

  // Load detail tanggal terpilih
  useEffect(() => {
    if (!user || !selectedDate) return;
    loadDayDetail();
    // eslint-disable-next-line
  }, [user, selectedDate]);

  async function loadMarkers() {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const data = await getAktivitasBulan(user.id, startDate, endDate);

      // Bangun markers
      const m = {};
      Object.keys(data.kegiatan).forEach((d) => {
        m[d] = m[d] || {};
        m[d].kegiatan = true;
      });
      Object.keys(data.transaksi).forEach((d) => {
        m[d] = m[d] || {};
        m[d].transaksi = true;
      });
      data.target.forEach((t) => {
        m[t.deadline] = m[t.deadline] || {};
        m[t.deadline].target = true;
      });
      Object.keys(data.notes).forEach((d) => {
        m[d] = m[d] || {};
        m[d].notes = true;
      });
      setMarkers(m);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function loadDayDetail() {
    setLoadingDetail(true);
    try {
      const data = await getAktivitasTanggal(user.id, selectedDate);
      setDayDetail(data);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoadingDetail(false);
    }
  }

  const totalItems = useMemo(() => {
    if (!dayDetail) return 0;
    return (
      dayDetail.kegiatan.length +
      dayDetail.transaksi.length +
      dayDetail.rencana.length +
      dayDetail.notes.length
    );
  }, [dayDetail]);

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kalender</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Lihat aktivitas berdasarkan tanggal.
        </p>
      </div>

      {/* Calendar */}
      {loading ? (
        <Loading />
      ) : (
        <Calendar
          value={currentMonth}
          onChange={setCurrentMonth}
          markers={markers}
          selected={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Detail tanggal terpilih */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold text-gray-900">
            {formatDateLong(selectedDate)}
          </h2>
          <span className="text-xs text-gray-500">{totalItems} aktivitas</span>
        </div>

        {loadingDetail ? (
          <Loading text="Memuat aktivitas..." />
        ) : totalItems === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-gray-500">
              Tidak ada aktivitas di tanggal ini.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Kegiatan */}
            {dayDetail.kegiatan.length > 0 && (
              <Section
                title="Kegiatan PKL"
                icon={ClipboardList}
                color="text-green-600 bg-green-100"
              >
                <div className="space-y-2">
                  {dayDetail.kegiatan.map((k) => (
                    <div
                      key={k.id}
                      onClick={() => navigate(`/kegiatan/${k.id}`)}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      {k.foto_url && (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          <img
                            src={getFotoUrl(k.foto_url)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {k.kegiatan}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {k.jam_mulai || "-"}{" "}
                          {k.jam_selesai && `– ${k.jam_selesai}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Transaksi */}
            {dayDetail.transaksi.length > 0 && (
              <Section
                title="Transaksi"
                icon={Wallet}
                color="text-blue-600 bg-blue-100"
              >
                <div className="divide-y divide-gray-100">
                  {dayDetail.transaksi.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigate(`/keuangan/edit/${t.id}`)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
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
                      <p
                        className={`text-sm font-semibold shrink-0 ${
                          t.jenis === "pemasukan"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.jenis === "pemasukan" ? "+" : "-"}
                        {formatRupiah(t.nominal)}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Rencana */}
            {dayDetail.rencana.length > 0 && (
              <Section
                title="Rencana"
                icon={Target}
                color="text-purple-600 bg-purple-100"
              >
                <ul className="divide-y divide-gray-100">
                  {dayDetail.rencana.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 p-3">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          r.selesai
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {r.selesai && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p
                        className={`text-sm flex-1 ${
                          r.selesai
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {r.isi}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Catatan */}
            {dayDetail.notes.length > 0 && (
              <Section
                title="Catatan"
                icon={StickyNote}
                color="text-amber-600 bg-amber-100"
              >
                <div className="space-y-2">
                  {dayDetail.notes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => navigate(`/catatan/edit/${n.id}`)}
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {n.judul || "Tanpa judul"}
                      </p>
                      {n.isi && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {n.isi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, color, children }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${color.split(" ")[1]}`}
        >
          <Icon className={`w-4 h-4 ${color.split(" ")[0]}`} />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function getFotoUrlInline(path) {
  // Inline helper agar tidak perlu import di file ini
  const { supabase } = require("../lib/supabase");
  const { data } = supabase.storage.from("dokumentasi").getPublicUrl(path);
  return data.publicUrl;
}
