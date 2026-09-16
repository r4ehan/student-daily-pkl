import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import ProfileSetup from "../pages/ProfileSetup";
import NotFound from "../pages/NotFound";

// Kegiatan
import KegiatanList from "../pages/kegiatan/KegiatanList";
import KegiatanForm from "../pages/kegiatan/KegiatanForm";
import KegiatanDetail from "../pages/kegiatan/KegiatanDetail";

// Keuangan
import KeuanganDashboard from "../pages/keuangan/KeuanganDashboard";
import KeuanganForm from "../pages/keuangan/KeuanganForm";
import KeuanganList from "../pages/keuangan/KeuanganList";

// Target
import TargetList from "../pages/target/TargetList";
import TargetForm from "../pages/target/TargetForm";

// Rencana
import RencanaList from "../pages/rencana/RencanaList";

// Catatan
import CatatanList from "../pages/catatan/CatatanList";
import CatatanForm from "../pages/catatan/CatatanForm";

// Kalender
import Kalender from "../pages/kalender/Kalender";

// Pengaturan
import Pengaturan from "../pages/pengaturan/Pengaturan";

// Menu
import MenuLengkap from "../pages/menu/MenuLengkap";

// Laporan
import Laporan from "../pages/laporan/Laporan";
import LaporanPreview from "../pages/laporan/LaporanPreview";

import Statistik from "../pages/statistik/Statistik";

import Layanan from "../pages/Layanan";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/profil-setup" element={<ProfileSetup />} />

        {/* Kegiatan */}
        <Route path="/kegiatan" element={<KegiatanList />} />
        <Route path="/kegiatan/baru" element={<KegiatanForm />} />
        <Route path="/kegiatan/:id" element={<KegiatanDetail />} />

        {/* Keuangan */}
        <Route path="/keuangan" element={<KeuanganDashboard />} />
        <Route path="/keuangan/riwayat" element={<KeuanganList />} />
        <Route path="/keuangan/baru" element={<KeuanganForm />} />
        <Route path="/keuangan/edit/:id" element={<KeuanganForm />} />

        {/* Target */}
        <Route path="/target" element={<TargetList />} />
        <Route path="/target/baru" element={<TargetForm />} />
        <Route path="/target/edit/:id" element={<TargetForm />} />

        {/* Rencana */}
        <Route path="/rencana" element={<RencanaList />} />

        {/* Catatan */}
        <Route path="/catatan" element={<CatatanList />} />
        <Route path="/catatan/baru" element={<CatatanForm />} />
        <Route path="/catatan/edit/:id" element={<CatatanForm />} />

        {/* Kalender */}
        <Route path="/kalender" element={<Kalender />} />

        {/* Pengaturan */}
        <Route path="/pengaturan" element={<Pengaturan />} />

        {/* Menu (mobile) */}
        <Route path="/menu" element={<MenuLengkap />} />

        {/* Laporan */}
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/laporan/preview" element={<LaporanPreview />} />

        <Route path="/statistik" element={<Statistik />} />

        <Route path="/layanan" element={<Layanan />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Placeholder({ title }) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mt-2">
        Halaman ini akan dibangun pada tahap berikutnya.
      </p>
    </div>
  );
}
