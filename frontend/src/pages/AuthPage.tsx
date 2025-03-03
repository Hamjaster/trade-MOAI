import { useLocation, useNavigate } from "react-router-dom";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import illustration from "@/assets/illustration.png";
import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { setToken } from "@/store/authSlice";

export default function AuthLayout() {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const isSignIn = location.pathname === "/login";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      console.log("User found in local storage");
      dispatch(setToken(token));
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth Forms */}
      <div className="flex-1 flex items-center justify- px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {isSignUp && <SignUpPage />}
          {isSignIn && <SignInPage />}
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 w-full h-full bg-grid-white/[0.2] [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="w-full max-w-xl text-center">
            <img
              src={illustration}
              alt="Trading Illustration"
              width={400}
              height={400}
              className="mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold mb-4">
              Start Your Trading Journey
            </h2>
            <p className="text-lg text-blue-100">
              Join thousands of traders who use Trade MOAI to centerimprove
              their trading performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
