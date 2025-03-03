"use client";

import { useDispatch, useSelector } from "react-redux";
import { googleContinue, loginUser } from "@/store/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { auth, continueWithGoogle, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

export function SignInForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isLoadingGoogle } = useAppSelector(
    (state: RootState) => state.auth
  );
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error(err);
      });
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleGoogleSignIn() {
    const data = await continueWithGoogle();
    if (data?.success && data.data) {
      dispatch(googleContinue({ user: data.data }))
        .unwrap()
        .then(() => {
          navigate("/dashboard");
        })
        .catch((err) => {
          toast.error(err || "Google Auth Error");
        });
    } else {
      toast.error(data?.message || "Google Auth Error");
    }
  }

  // Replace with your actual reCAPTCHA site key
  const RECAPTCHA_SITE_KEY = "6Le9DbYqAAAAAMR8ndKxyGANwcyeaaAGlJPtI12p";

  return (
    <div className="space-y-6 mt-6">
      <Button
        variant="outline"
        type="button"
        disabled={isLoadingGoogle}
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        {isLoadingGoogle ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" className="px-0" disabled={isLoading}>
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center w-full">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
        <p className="text-sm text-gray-500">
          Not registered?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="hover:underline cursor-pointer text-gray-700"
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}
