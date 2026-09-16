import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { signIn } from "../../services/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(form);
      navigate("/");
    } catch (err) {
      setToast({ type: "error", message: err.message || "Login gagal" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Student Daily</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akunmu</p>
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

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            <LogIn className="w-4 h-4 mr-2" /> Masuk
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
