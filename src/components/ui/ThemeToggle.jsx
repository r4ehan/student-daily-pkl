import { Sun, Moon } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === "dark"
          ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${className}`}
      aria-label={`Ganti ke mode ${theme === "dark" ? "terang" : "gelap"}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
