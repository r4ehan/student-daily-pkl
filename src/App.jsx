import { useState } from "react"; // ✅ TAMBAHKAN INI (Paling Penting!)
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import InstallPrompt from "./components/layout/InstallPrompt";
import ScrollToTop from "./components/layout/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/ui/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      {/* Tampilkan Splash Screen jika showSplash masih true */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Aplikasi Utama */}
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ScrollToTop />
              <InstallPrompt />
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
