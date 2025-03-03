import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store";
import SplashPage from "./pages/SplashPage";
import DashboardPage from "./pages/Dashboard/Dashboard";
import VerifyPage from "./pages/VerifyEmail";
import AuthLayout from "./pages/AuthPage";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import CalendarPage from "./pages/Dashboard/Calendar";
import UploadTradesPage from "./pages/Dashboard/Upload";
import { JournalPage } from "./pages/Dashboard/Journal";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return token ? children : null;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <Provider store={store}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="font-gothic">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="upload" element={<UploadTradesPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="/signup" element={<AuthLayout />} />
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/verify/:email" element={<VerifyPage />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
