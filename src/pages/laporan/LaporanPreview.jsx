import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Copy, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";
import {
  getKegiatanPeriode,
  getProfilLaporan,
} from "../../services/laporanService";
import {
  generateBahanLaporan,
  generateLaporanPDF,
} from "../../utils/laporanGenerator";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import Toast from "../../components/ui/Toast";

export default function LaporanPreview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { period, startDate, endDate } = location.state || {};

  const [kegiatan, setKegiatan] = useState([]);
  const [profil, setProfil] = useState(null);
  const [bahanLaporan, setBahanLaporan] = useState("");
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
      setBahanLaporan(generateBahanLaporan(kegData, profilData));
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(bahanLaporan);
    setToast({
      type: "success",
      message: "✓ Bahan laporan disalin ke clipboard.",
    });
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan PKL</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${bahanLaporan}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    const pdfText = generateLaporanPDF(kegiatan, profil, period);
    const lines = pdfText.split("\n");

    let y = 10;
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 5;
    });

    doc.save(`Laporan_PKL_${period.replace(/\s/g, "_")}.pdf`);
    setToast({ type: "success", message: "✓ PDF berhasil diunduh." });
  }

  if (loading) return <Loading />;

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy} size="sm">
            <Copy className="w-4 h-4 mr-1" /> Salin
          </Button>
          <Button variant="outline" onClick={handlePrint} size="sm">
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
          <Button onClick={handleExportPDF} size="sm">
            <Download className="w-4 h-4 mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preview Laporan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Periode: {period}</p>
      </div>

      <Card className="p-5">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
          {bahanLaporan}
        </pre>
      </Card>
    </div>
  );
}
