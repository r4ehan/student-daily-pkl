import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { signUp } from "../../services/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setToast({ type: "error", message: "Password tidak cocok" });
      return;
    }
    if (form.password.length < 6) {
      setToast({ type: "error", message: "Password minimal 6 karakter" });
      return;
    }
    setLoading(true);
    try {
      await signUp({ email: form.email, password: form.password });
      setToast({
        type: "success",
        message: "Registrasi berhasil! Silakan login.",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Registrasi gagal" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
          <p className="text-sm text-gray-500 mt-1">
            Mulai catat kegiatan PKL-mu
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nama@email.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimal 6 karakter"
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />

          <Button type="submit" loading={loading} className="w-full">
            <UserPlus className="w-4 h-4 mr-2" /> Daftar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
