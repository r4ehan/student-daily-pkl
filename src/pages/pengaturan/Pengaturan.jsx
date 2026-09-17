import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Key,
  Palette,
  Info,
  MessageCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Mail,
  Phone,
  ExternalLink,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  // TAMBAHKAN INI:
  BookOpen,
  ClipboardList,
  Camera,
  Wallet,
  CalendarCheck,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { upsertProfile } from "../../services/profileService";
import { supabase } from "../../lib/supabase";
import { signOut } from "../../services/authService";
import useTheme from "../../hooks/useTheme";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Bell, BellOff } from "lucide-react";
import useDailyNotifications from "../../hooks/useDailyNotifications";

// Menu items
const MENU_ITEMS = {
  EDIT_PROFILE: "edit_profile",
  GANTI_PASSWORD: "ganti_password",
  TEMA: "tema",
  TENTANG: "tentang",
  BANTUAN: "bantuan",
};

// Komponen kecil untuk list cara pemakaian
function GuideItem({ step, title, desc, icon: Icon }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {step < 5 && (
          <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-1" />
        )}
      </div>
      <div className="pb-4">
        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function Pengaturan() {
  const { user, profile, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const { permission, scheduled, enableNotifications, isSupported } =
    useDailyNotifications();
  const [notifLoading, setNotifLoading] = useState(false);

  // Form states
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    jurusan: "",
    sekolah: "",
    tempat_pkl: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });
  const [saving, setSaving] = useState(false);

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        nama: profile.nama || "",
        kelas: profile.kelas || "",
        jurusan: profile.jurusan || "",
        sekolah: profile.sekolah || "",
        tempat_pkl: profile.tempat_pkl || "",
        tanggal_mulai: profile.tanggal_mulai || "",
        tanggal_selesai: profile.tanggal_selesai || "",
      });
    }
  }, [profile]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertProfile(user.id, form);
      refreshProfile();
      setToast({ type: "success", message: "✓ Profil berhasil diperbarui." });
      setActiveMenu(null);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ type: "error", message: "Password tidak cocok." });
      return;
    }
    if (newPassword.length < 6) {
      setToast({ type: "error", message: "Password minimal 6 karakter." });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setToast({ type: "success", message: "✓ Password berhasil diubah." });
      setNewPassword("");
      setConfirmPassword("");
      setActiveMenu(null);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  }

  async function handleToggleNotif() {
    if (permission === "granted") {
      // Kalau sudah granted, tampilkan info saja
      setToast({
        type: "info",
        message: "Notifikasi sudah aktif. Kamu akan menerima pengingat harian.",
      });
      return;
    }

    setNotifLoading(true);
    const result = await enableNotifications();
    setNotifLoading(false);

    if (result === "granted") {
      setToast({ type: "success", message: "✓ Notifikasi harian diaktifkan!" });
    } else if (result === "denied") {
      setToast({
        type: "error",
        message:
          "Izin notifikasi ditolak. Aktifkan manual di pengaturan browser.",
      });
    }
  }

  // Render Header
  function renderHeader() {
    return (
      <div className="flex items-center gap-3 mb-6">
        {activeMenu && (
          <button
            onClick={() => setActiveMenu(null)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activeMenu ? getMenuTitle(activeMenu) : "Pengaturan"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {activeMenu ? "" : "Kelola profil, tema, dan akunmu."}
          </p>
        </div>
      </div>
    );
  }

  function getMenuTitle(menu) {
    const titles = {
      [MENU_ITEMS.EDIT_PROFILE]: "Edit Profil",
      [MENU_ITEMS.GANTI_PASSWORD]: "Ganti Password",
      [MENU_ITEMS.TEMA]: "Tampilan",
      [MENU_ITEMS.TENTANG]: "Tentang Aplikasi",
      [MENU_ITEMS.BANTUAN]: "Bantuan & CS",
    };
    return titles[menu] || "";
  }

  // Render Menu Item
  function MenuItem({ icon: Icon, title, subtitle, onClick, color = "blue" }) {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
      green: "bg-green-100 dark:bg-green-900/30 text-green-600",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
      amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
      pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600",
    };

    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  {
    isSupported && (
      <MenuItem
        icon={permission === "granted" ? Bell : BellOff}
        title="Notifikasi Harian"
        subtitle={
          permission === "granted"
            ? "Aktif - 3 pengingat/hari"
            : permission === "denied"
              ? "Ditolak - aktifkan di browser"
              : "Belum diaktifkan"
        }
        onClick={handleToggleNotif}
        color="blue"
      />
    );
  }

  // Render Main Menu
  function renderMainMenu() {
    return (
      <div className="space-y-3">
        <MenuItem
          icon={User}
          title="Edit Profil"
          subtitle="Ubah data pribadi dan PKL"
          onClick={() => setActiveMenu(MENU_ITEMS.EDIT_PROFILE)}
          color="blue"
        />

        <MenuItem
          icon={Key}
          title="Ganti Password"
          subtitle="Ubah password akunmu"
          onClick={() => setActiveMenu(MENU_ITEMS.GANTI_PASSWORD)}
          color="green"
        />

        <MenuItem
          icon={Palette}
          title="Tema"
          subtitle={theme === "dark" ? "Mode Gelap aktif" : "Mode Terang aktif"}
          onClick={() => setActiveMenu(MENU_ITEMS.TEMA)}
          color="purple"
        />

        <MenuItem
          icon={Info}
          title="Tentang Aplikasi"
          subtitle="Info versi dan developer"
          onClick={() => setActiveMenu(MENU_ITEMS.TENTANG)}
          color="amber"
        />

        <MenuItem
          icon={MessageCircle}
          title="Bantuan & CS"
          subtitle="Hubungi kami"
          onClick={() => setActiveMenu(MENU_ITEMS.BANTUAN)}
          color="pink"
        />

        {/* Logout */}
        <div className="pt-3">
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-600 text-sm">
                Keluar dari Akun
              </p>
              <p className="text-xs text-red-500/80 mt-0.5">
                Logout dari aplikasi
              </p>
            </div>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    );
  }

  // Render Edit Profile Form
  function renderEditProfile() {
    return (
      <Card className="p-5">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            placeholder="M. Raehan Al Fahri"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kelas"
              value={form.kelas}
              onChange={(e) => set("kelas", e.target.value)}
              placeholder="XII TKJ 2"
            />
            <Input
              label="Jurusan"
              value={form.jurusan}
              onChange={(e) => set("jurusan", e.target.value)}
              placeholder="TKJ"
            />
          </div>
          <Input
            label="Sekolah"
            value={form.sekolah}
            onChange={(e) => set("sekolah", e.target.value)}
            placeholder="SMK YP 96 Bukit Kemuning"
          />

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Data PKL
            </h3>
            <Input
              label="Tempat PKL"
              value={form.tempat_pkl}
              onChange={(e) => set("tempat_pkl", e.target.value)}
              placeholder="Percetakan Rahmat Wijaya"
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input
                label="Tanggal Mulai"
                type="date"
                value={form.tanggal_mulai}
                onChange={(e) => set("tanggal_mulai", e.target.value)}
              />
              <Input
                label="Tanggal Selesai"
                type="date"
                value={form.tanggal_selesai}
                onChange={(e) => set("tanggal_selesai", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" loading={saving} className="w-full mt-4">
            <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
          </Button>
        </form>
      </Card>
    );
  }

  // Render Change Password Form
  function renderChangePassword() {
    return (
      <Card className="p-5">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Input
            label="Konfirmasi Password Baru"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
          />

          <Button
            type="submit"
            loading={changingPassword}
            className="w-full mt-4"
          >
            <Key className="w-4 h-4 mr-2" /> Simpan Password Baru
          </Button>
        </form>
      </Card>
    );
  }

  // Render Theme Settings
  function renderTheme() {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Mode {theme === "dark" ? "Gelap" : "Terang"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {theme === "dark" ? "Nyaman di malam hari" : "Terang dan jelas"}
            </p>
          </div>
        </div>

        {/* Pilihan Tema */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => theme !== "light" && toggleTheme()}
            className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              theme === "light"
                ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Sun
              className={`w-5 h-5 ${theme === "light" ? "text-amber-500" : "text-gray-400"}`}
            />
            <span
              className={`text-sm font-medium ${theme === "light" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}
            >
              Terang
            </span>
            {theme === "light" && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={() => theme !== "dark" && toggleTheme()}
            className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              theme === "dark"
                ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Moon
              className={`w-5 h-5 ${theme === "dark" ? "text-indigo-400" : "text-gray-400"}`}
            />
            <span
              className={`text-sm font-medium ${theme === "dark" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}
            >
              Gelap
            </span>
            {theme === "dark" && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Tema akan tersimpan otomatis di perangkat kamu.
        </p>
      </Card>
    );
  }

  // Render About App
  function renderAbout() {
    return (
      <div className="space-y-4">
        {/* Info Aplikasi dengan Logo */}
        <Card className="p-5 text-center">
          <div className="flex flex-col items-center">
            {/* GANTI ICON DENGAN LOGO */}
            <img
              src="/icon-192.png"
              alt="Student Daily PKL Logo"
              className="w-20 h-20 rounded-2xl shadow-lg mb-3"
            />
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Student Daily PKL
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Versi 1.0.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Aplikasi Pencatatan Kegiatan PKL
            </p>
          </div>
        </Card>

        {/* Spesifikasi Teknis */}
        <Card className="p-5">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
            Informasi Teknis
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">
                Developer
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                team Student Daily
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">
                Teknologi
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                React + Vite
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Database</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Supabase
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 dark:text-gray-400">
                Tanggal pembuatan
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                12 September 2026
              </span>
            </div>
          </div>
        </Card>

        {/* CARA PEMAKAIAN (BARU) */}
        <Card className="p-5">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" /> Cara Pemakaian
          </h4>

          <div className="pl-1">
            <GuideItem
              step={1}
              title="Catat Kegiatan Harian"
              desc="Gunakan menu 'Kegiatan' atau tombol 'Catat Cepat' di Dashboard untuk mencatat aktivitas PKL-mu setiap hari."
              icon={ClipboardList}
            />
            <GuideItem
              step={2}
              title="Upload Foto Dokumentasi"
              desc="Tambahkan foto saat mencatat kegiatan sebagai bukti dokumentasi untuk laporan."
              icon={Camera}
            />
            <GuideItem
              step={3}
              title="Kelola Keuangan & Target"
              desc="Catat pemasukan/pengeluaran dan buat target tabungan agar lebih termotivasi."
              icon={Wallet}
            />
            <GuideItem
              step={4}
              title="Buat Rencana Besok"
              desc="Gunakan menu 'Rencana' untuk mencatat todo list agar kerja lebih terarah."
              icon={CalendarCheck}
            />
            <GuideItem
              step={5}
              title="Generate Laporan PKL"
              desc="Buka menu 'Laporan', pilih periode, dan klik 'Generate' untuk membuat bahan laporan formal secara otomatis."
              icon={FileText}
            />
          </div>
        </Card>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-4">
          Aplikasi ini dirancang untuk membantu pelajar SMK mencatat kegiatan
          PKL dengan mudah dan tidak lupa saat membuat laporan akhir, mohon maaf
          jika masih ada bug dan kekurangan dalam aplikasi ini, silahkan hubungi
          customer service jika ada keluhan atau pertanyaan terkait aplikasi
          ini.
        </p>
      </div>
    );
  }

  // Render Help & CS
  function renderHelp() {
    return (
      <div className="space-y-3">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Hubungi Kami
          </h3>

          <div className="space-y-3">
            <a
              href="https://wa.me/6281272695418"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  WhatsApp
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  +62 812-7269-5418
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>

            <a
              href="mailto:support@studentdailypkl.com"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  Email
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  support@studentdailypkl.com
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Jam operasional: Senin - Sabtu, 08:00 - 21:00 WIB
          </p>
        </Card>
      </div>
    );
  }

  // Render Content Based on Active Menu
  function renderContent() {
    switch (activeMenu) {
      case MENU_ITEMS.EDIT_PROFILE:
        return renderEditProfile();
      case MENU_ITEMS.GANTI_PASSWORD:
        return renderChangePassword();
      case MENU_ITEMS.TEMA:
        return renderTheme();
      case MENU_ITEMS.TENTANG:
        return renderAbout();
      case MENU_ITEMS.BANTUAN:
        return renderHelp();
      default:
        return renderMainMenu();
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {renderHeader()}
      {renderContent()}

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Keluar dari akun?"
        message="Kamu harus login kembali untuk mengakses data."
        confirmText="Ya, Keluar"
        variant="danger"
      />
    </div>
  );
}
