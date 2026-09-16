import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <p className="text-gray-600 mt-2">Halaman tidak ditemukan</p>
        <Link to="/">
          <Button className="mt-4">Kembali ke Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
