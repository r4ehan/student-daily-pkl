import { NavLink } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Wallet,
  Target,
  Menu,
  BarChart3,
} from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/kegiatan", label: "Kegiatan", icon: ClipboardList },
  { to: "/keuangan", label: "Keuangan", icon: Wallet },
  { to: "/target", label: "Target", icon: Target },
  { to: "/menu", label: "Menu", icon: Menu },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2.5 text-xs transition-colors ${
                  isActive
                    ? "text-primary font-semibold dark:text-white"
                    : "text-gray-500 dark:text-gray-500"
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
