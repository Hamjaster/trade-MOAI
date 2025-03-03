import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Trade MOAI</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={handleLogout} variant="ghost">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to your Trading Journal
          </h1>
          <p className="mt-2 text-gray-600">
            Start tracking your trades and improve your performance.
          </p>
        </div>
      </main>
    </div>
  );
}
