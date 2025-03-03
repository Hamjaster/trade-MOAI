import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import {
  BarChart,
  Calendar,
  HelpCircle,
  Layout,
  LogOut,
  Settings,
  Upload,
  User,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Layout },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Upload Trades", href: "/dashboard/upload", icon: Upload },
  { name: "Trading Stats", href: "/dashboard/stats", icon: BarChart },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Moai Guidance", href: "/dashboard/guidance", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = useLocation().pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-bold">Trade MOAI</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 font-semibold"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </div>
      </div>
    </div>
  );
}
