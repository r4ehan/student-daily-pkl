import { formatDateLong } from "./helpers";

/**
 * Smart Summary: menghasilkan ringkasan otomatis dari kegiatan PKL.
 * Menganalisis pola, frekuensi, dan tema kegiatan.
 */
export function generateSmartSummary(kegiatanList, profil) {
  if (!kegiatanList || kegiatanList.length === 0) {
    return {
      ringkasan: "Belum ada kegiatan yang dicatat.",
      highlights: [],
      skills: [],
      stats: null,
    };
  }

  // ===== 1. STATISTIK DASAR =====
  const uniqueDays = new Set(kegiatanList.map((k) => k.tanggal)).size;
  const totalKegiatan = kegiatanList.length;

  // ===== 2. ANALISIS TEMA =====
  const temaKeywords = {
    desain: [
      "desain",
      "design",
      "corel",
      "photoshop",
      "illustrator",
      "banner",
      "undangan",
      "logo",
      "layout",
      "warna",
      "typografi",
    ],
    cetak: [
      "cetak",
      "print",
      "printing",
      "mesin",
      "finishing",
      "laminate",
      "jilid",
      "potong",
    ],
    komputer: [
      "komputer",
      "network",
      "jaringan",
      "server",
      "install",
      "konfigurasi",
      "troubleshoot",
      "wifi",
      "router",
    ],
    administrasi: [
      "admin",
      "arsip",
      "file",
      "dokumen",
      "surat",
      "data",
      "input",
      "excel",
      "word",
    ],
    programming: [
      "code",
      "program",
      "web",
      "html",
      "css",
      "javascript",
      "database",
      "api",
      "bug",
      "debug",
    ],
    customer: [
      "pelanggan",
      "customer",
      "order",
      "pesanan",
      "komplain",
      "layan",
      "kasir",
    ],
    maintenance: [
      "rawat",
      "periksa",
      "cek",
      "service",
      "bersih",
      "maintenance",
      "update",
    ],
    belajar: ["belajar", "pelajari", "tutorial", "baca", "riset", "eksplor"],
  };

  const temaCount = {};
  kegiatanList.forEach((k) => {
    const text =
      `${k.kegiatan} ${k.software || ""} ${k.pembelajaran || ""}`.toLowerCase();
    Object.entries(temaKeywords).forEach(([tema, keywords]) => {
      if (keywords.some((kw) => text.includes(kw))) {
        temaCount[tema] = (temaCount[tema] || 0) + 1;
      }
    });
  });

  const topTema = Object.entries(temaCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tema]) => tema);

  // ===== 3. EKSTRAK SKILL =====
  const skillKeywords = [
    "corel",
    "photoshop",
    "illustrator",
    "canva",
    "figma",
    "excel",
    "word",
    "powerpoint",
    "html",
    "css",
    "javascript",
    "python",
    "php",
    "mysql",
    "database",
    "sql",
    "router",
    "switch",
    "mikrotik",
    "cisco",
    "printer",
    "mesin",
    "alat",
  ];

  const skills = new Set();
  kegiatanList.forEach((k) => {
    const text = `${k.kegiatan} ${k.software || ""}`.toLowerCase();
    skillKeywords.forEach((skill) => {
      if (text.includes(skill)) skills.add(skill);
    });
  });

  // ===== 4. HIGHLIGHT HARI =====
  const highlights = [];
  kegiatanList.forEach((k) => {
    if (k.pembelajaran?.trim()) {
      highlights.push({
        tanggal: k.tanggal,
        text: k.pembelajaran,
        type: "belajar",
      });
    }
    if (k.solusi?.trim()) {
      highlights.push({
        tanggal: k.tanggal,
        text: k.solusi,
        type: "solusi",
      });
    }
  });

  // ===== 5. GENERATE NARASI =====
  const nama = profil?.nama?.split(" ")[0] || "Peserta";
  const tempat = profil?.tempat_pkl || "tempat PKL";
  const firstDate = kegiatanList[0]?.tanggal;
  const lastDate = kegiatanList[kegiatanList.length - 1]?.tanggal;

  let narasi = "";

  if (uniqueDays === 1) {
    narasi = `Pada ${formatDateLong(firstDate)}, ${nama} melaksanakan kegiatan PKL di ${tempat}. `;
  } else {
    narasi = `Selama periode ${formatDateLong(firstDate)} hingga ${formatDateLong(lastDate)}, ${nama} telah melaksanakan PKL di ${tempat} selama ${uniqueDays} hari kerja. `;
  }

  narasi += `Total terdapat ${totalKegiatan} catatan kegiatan yang terdokumentasi. `;

  if (topTema.length > 0) {
    const temaLabel = {
      desain: "bidang desain grafis",
      cetak: "proses produksi cetak",
      komputer: "bidang jaringan dan IT",
      administrasi: "pekerjaan administrasi",
      programming: "pengembangan perangkat lunak",
      customer: "layanan pelanggan",
      maintenance: "pemeliharaan dan perawatan",
      belajar: "aktivitas pembelajaran",
    };
    const temaText = topTema.map((t) => temaLabel[t] || t).join(", ");
    narasi += `Kegiatan utama berfokus pada ${temaText}. `;
  }

  if (skills.size > 0) {
    const skillList = Array.from(skills).slice(0, 5).join(", ");
    narasi += `Selama PKL, ${nama} menggunakan berbagai tools dan teknologi seperti ${skillList}. `;
  }

  const belajarCount = highlights.filter((h) => h.type === "belajar").length;
  if (belajarCount > 0) {
    narasi += `Terdapat ${belajarCount} momen pembelajaran penting yang dicatat selama periode ini. `;
  }

  narasi += `Seluruh kegiatan telah didokumentasikan dengan baik sebagai bahan evaluasi dan laporan PKL.`;

  return {
    ringkasan: narasi,
    highlights: highlights.slice(0, 5),
    skills: Array.from(skills),
    topTema,
    stats: {
      totalHari: uniqueDays,
      totalKegiatan,
      avgKegiatanPerHari: (totalKegiatan / uniqueDays).toFixed(1),
    },
  };
}

/**
 * Generate ringkasan per minggu (untuk laporan mingguan).
 */
export function generateWeeklySummary(kegiatanList, weekStart, weekEnd) {
  const weekKegiatan = kegiatanList.filter((k) => {
    return k.tanggal >= weekStart && k.tanggal <= weekEnd;
  });

  if (weekKegiatan.length === 0) {
    return `Tidak ada kegiatan yang dicatat pada minggu ini.`;
  }

  const uniqueDays = new Set(weekKegiatan.map((k) => k.tanggal)).size;
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  let summary = `Minggu ini (${formatDateLong(weekStart)} - ${formatDateLong(weekEnd)}):\n\n`;
  summary += `Total ${weekKegiatan.length} kegiatan dalam ${uniqueDays} hari kerja.\n\n`;

  // Group by hari
  const byDay = {};
  weekKegiatan.forEach((k) => {
    const dayName = days[new Date(k.tanggal).getDay()];
    if (!byDay[dayName]) byDay[dayName] = [];
    byDay[dayName].push(k.kegiatan);
  });

  Object.entries(byDay).forEach(([day, items]) => {
    summary += `${day}:\n`;
    items.forEach((item, i) => {
      summary += `  ${i + 1}. ${item}\n`;
    });
    summary += "\n";
  });

  return summary;
}
