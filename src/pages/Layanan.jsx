import { Link } from "react-router-dom";
import {
  FileText,
  Globe,
  CheckCircle2,
  Phone,
  MessageCircle,
  Star,
  Award,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import Card from "../components/ui/Card";

export default function Layanan() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Layanan & Jasa
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Solusi profesional untuk kebutuhan akademik dan digital Anda
        </p>
      </div>

      {/* Promo Banner */}
      <Card className="p-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Promo Spesial
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">
            Diskon 20% untuk 5 Klien Pertama!
          </h2>
          <p className="text-sm opacity-90 mb-3">
            Gratis konsultasi tanpa kewajiban. Slot terbatas!
          </p>
          <a
            href="https://wa.me/6281272695418?text=Halo,%20saya%20tertarik%20dengan%20jasa%20Anda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Klaim Promo Sekarang
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Card>

      {/* Jasa 1: Laporan PKL */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Jasa Bantuan Laporan PKL
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Bimbingan penyusunan laporan PKL dari nol sampai ACC
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {[
            "Penyusunan catatan harian kegiatan",
            "Pembuatan bab 1-5 lengkap",
            "Formatting & layout profesional",
            "Konsultasi revisi unlimited",
            "Garansi ACC atau uang kembali",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Harga Mulai Dari
            </span>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              Rp 30.000
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            *Harga bisa nego tergantung kompleksitas laporan
          </p>
        </div>
      </Card>

      {/* Jasa 2: Pembuatan Website */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            <Globe className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Jasa Pembuatan Website
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Website modern, responsif, dan profesional untuk bisnis Anda
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {[
            "Company Profile / Portofolio",
            "Landing Page / Toko Online",
            "Web App (React + Supabase)",
            "Desain modern & responsif",
            "Gratis konsultasi & revisi",
            "Bantuan hosting & domain",
            "Support 1 bulan setelah jadi",
            "Dll sesuai kebutuhan anda",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Harga Mulai Dari
            </span>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              Rp 100.000
            </span>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            *Harga bisa nego tergantung fitur yang diminta
          </p>
        </div>
      </Card>

      {/* Kenapa Pilih Kami */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Kenapa Pilih Kami?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Pengerjaan Cepat
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Deadline ketat? Kami siap bantu!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Garansi Revisi
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Revisi sampai puas tanpa biaya tambahan
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Harga Pelajar
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Terjangkau untuk kantong pelajar
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Konsultasi Gratis
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Tanya-tanya dulu tanpa kewajiban
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Testimonial */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Kata Mereka
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
              "Makasih banyak! Laporan PKL saya ACC tanpa revisi. Penjelasannya
              juga detail banget. Sangat recommended!"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              - Andi, XII TKJ
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
              "Website toko online saya jadi keren dan profesional. Pelanggan
              makin percaya dan orderan meningkat!"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              - Budi, Owner UMKM
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
              "Pengerjaan cepat, hasil rapi, harga bersahabat. Pasti bakal order
              lagi kalau butuh!"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              - Siti, XII RPL
            </p>
          </div>
        </div>
      </Card>

      {/* Portofolio */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Portofolio
        </h3>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Student Daily PKL
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Aplikasi pencatatan kegiatan PKL dengan fitur lengkap: auth,
                database, PWA, dark mode, dan notifikasi.
              </p>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                Lihat Demo
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* CTA Final */}
      <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Tertarik? Yuk Konsultasi!</h3>
          <p className="text-sm opacity-90 mb-4">
            Gratis konsultasi tanpa kewajiban. Slot terbatas!
          </p>
          <a
            href="https://wa.me/6281272695418?text=Halo,%20saya%20tertarik%20dengan%20jasa%20Anda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Hubungi via WhatsApp
          </a>
          <p className="text-xs opacity-75 mt-3">Respon cepat dalam 1x22 jam</p>
        </div>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
        <p>Dibuat dengan ❤️ untuk membantu sesama pelajar</p>
      </div>
    </div>
  );
}
