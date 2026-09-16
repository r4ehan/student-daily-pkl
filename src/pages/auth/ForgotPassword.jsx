import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { resetPassword } from "../../services/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      setToast({
        type: "success",
        message: "Link reset password telah dikirim ke email.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Gagal mengirim email",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Lupa Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Masukkan email untuk menerima link reset
          </p>
        </div>

        {sent ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-700">
              Jika email terdaftar, link reset telah dikirim. Periksa inbox-mu.
            </p>
            <Link
              to="/login"
              className="text-sm text-primary mt-4 inline-block hover:underline"
            >
              Kembali ke login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
          >
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full">
              Kirim Link
            </Button>
            <Link
              to="/login"
              className="block text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Kembali ke login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
