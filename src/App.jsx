import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import InstallPrompt from "./components/layout/InstallPrompt";
import ScrollToTop from "./components/layout/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      {/* Tambahkan prop 'future' di sini untuk menghilangkan warning */}
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
