import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { googleContinue, registerUser } from "@/store/authSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import toast from "react-hot-toast";
import { auth, continueWithGoogle, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import ReCAPTCHA from "react-google-recaptcha";

// Replace with your actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = "6Le9DbYqAAAAAMR8ndKxyGANwcyeaaAGlJPtI12p";

export function SignUpForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success, isLoadingGoogle } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    nameOfSpace: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

    // Here you would typically verify the captcha token on your server
    // For this example, we'll assume it's valid if it exists

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        console.log("success");
        navigate(`/verify/${formData.email}`);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        // Reset the captcha on error
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      });
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

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
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
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or use your email address
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            disabled={isLoading}
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            disabled={isLoading}
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameOfSpace">Name of Space</Label>
          <Input
            id="nameOfSpace"
            name="nameOfSpace"
            type="text"
            required
            disabled={isLoading}
            value={formData.nameOfSpace}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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

      <div className="flex justify-center w-full">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
        />
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={isLoading || !captchaToken}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Sign Up for Trade MOAI
      </Button>
    </form>
  );
}
