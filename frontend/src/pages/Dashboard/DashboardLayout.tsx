import { Sidebar } from "@/components/dashboard/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {" "}
        <Outlet />
      </main>
    </div>
  );
}
