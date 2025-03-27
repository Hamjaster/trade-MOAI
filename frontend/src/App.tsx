import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store, { RootState, useAppDispatch } from "./store";
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
import jwt from "jsonwebtoken";
import moment from "moment";
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const { token, tokenExpiry } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      try {
        const now = Math.floor(Date.now() / 1000); // Current time in UNIX format

        if (tokenExpiry && now >= Number(tokenExpiry)) {
          console.log("Token expired, logging out...");
          localStorage.removeItem("user_token");
          navigate("/login"); // Redirect to login
        } else {
          console.log("User found in local storage, token valid");
          // dispatch(setToken(token));
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        console.log("Invalid token format, removing...");
        localStorage.removeItem("user_token");
        navigate("/login");
      }
    }
  }, [dispatch]);

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
