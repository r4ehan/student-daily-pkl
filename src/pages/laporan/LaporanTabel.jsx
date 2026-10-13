import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, FileText, Copy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getKegiatanPeriode,
  getProfilLaporan,
} from "../../services/laporanService";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import Toast from "../../components/ui/Toast";
import { formatDateLong } from "../../utils/helpers";

export default function LaporanTabel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { period, startDate, endDate } = location.state || {};

  const [kegiatan, setKegiatan] = useState([]);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const [kegData, profilData] = await Promise.all([
        getKegiatanPeriode(
          user.id,
          startDate || "2000-01-01",
          endDate || new Date().toISOString().split("T")[0],
        ),
        getProfilLaporan(user.id),
      ]);
      setKegiatan(kegData);
      setProfil(profilData);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  // Export ke Word
  function exportToWord() {
    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Laporan PKL</title></head>
      <body>
        <h2 style="text-align: center;">LAPORAN KEGIATAN PRAKTIK KERJA LAPANGAN (PKL)</h2>
        <br/>
        <table border="0" style="width: 100%;">
          <tr><td>Nama</td><td>: ${profil?.nama || "-"}</td></tr>
          <tr><td>Kelas</td><td>: ${profil?.kelas || "-"}</td></tr>
          <tr><td>Jurusan</td><td>: ${profil?.jurusan || "-"}</td></tr>
          <tr><td>Sekolah</td><td>: ${profil?.sekolah || "-"}</td></tr>
          <tr><td>Tempat PKL</td><td>: ${profil?.tempat_pkl || "-"}</td></tr>
          <tr><td>Periode</td><td>: ${period || "-"}</td></tr>
        </table>
        <br/>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; text-align: center;">No</th>
              <th style="padding: 10px; text-align: center;">Tanggal</th>
              <th style="padding: 10px; text-align: center;">Kegiatan</th>
              <th style="padding: 10px; text-align: center;">Paraf</th>
            </tr>
          </thead>
          <tbody>
            ${kegiatan
              .map(
                (k, i) => `
              <tr>
                <td style="padding: 8px; text-align: center;">${i + 1}</td>
                <td style="padding: 8px;">${formatDateLong(k.tanggal)}</td>
                <td style="padding: 8px;">${k.kegiatan}</td>
                <td style="padding: 8px; text-align: center;">&nbsp;</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", wordContent], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_PKL_Tabel_${period?.replace(/\s/g, "_") || "Semua"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ type: "success", message: "✓ File Word berhasil diunduh." });
  }

  // Export ke PDF (menggunakan window.print)
  function exportToPDF() {
    window.print();
  }

  // Copy ke clipboard
  function copyToClipboard() {
    const text = kegiatan
      .map((k, i) => `${i + 1}. ${formatDateLong(k.tanggal)} - ${k.kegiatan}`)
      .join("\n");

    navigator.clipboard.writeText(text);
    setToast({ type: "success", message: "✓ Disalin ke clipboard." });
  }

  if (loading) return <Loading />;

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header - Hidden saat print */}
      <div className="no-print flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard} size="sm">
            <Copy className="w-4 h-4 mr-1" /> Salin
          </Button>
          <Button variant="outline" onClick={exportToWord} size="sm">
            <FileText className="w-4 h-4 mr-1" /> Export Word
          </Button>
          <Button onClick={exportToPDF} size="sm">
            <Printer className="w-4 h-4 mr-1" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Konten Laporan */}
      <div className="print-container">
        <Card className="p-8">
          {/* Header Laporan */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              LAPORAN KEGIATAN PRAKTIK KERJA LAPANGAN (PKL)
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Periode: {period || "Semua Waktu"}
            </p>
          </div>

          {/* Info Siswa */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="w-32 text-gray-600 dark:text-gray-400">
                    Nama
                  </td>
                  <td className="text-gray-900 dark:text-gray-100">
                    : {profil?.nama || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 dark:text-gray-400">Kelas</td>
                  <td className="text-gray-900 dark:text-gray-100">
                    : {profil?.kelas || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 dark:text-gray-400">Jurusan</td>
                  <td className="text-gray-900 dark:text-gray-100">
                    : {profil?.jurusan || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 dark:text-gray-400">Sekolah</td>
                  <td className="text-gray-900 dark:text-gray-100">
                    : {profil?.sekolah || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 dark:text-gray-400">
                    Tempat PKL
                  </td>
                  <td className="text-gray-900 dark:text-gray-100">
                    : {profil?.tempat_pkl || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabel Kegiatan */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-100 w-12">
                    No
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-100 w-48">
                    Tanggal
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">
                    Kegiatan
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-100 w-32">
                    Paraf
                  </th>
                </tr>
              </thead>
              <tbody>
                {kegiatan.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="border border-gray-300 dark:border-gray-600 px-4 py-8 text-center text-gray-500"
                    >
                      Tidak ada kegiatan dalam periode ini.
                    </td>
                  </tr>
                ) : (
                  kegiatan.map((k, i) => (
                    <tr key={k.id}>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                        {i + 1}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatDateLong(k.tanggal)}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {k.kegiatan}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-sm">
                        &nbsp;
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
