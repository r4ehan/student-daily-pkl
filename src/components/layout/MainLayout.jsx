import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-black">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
