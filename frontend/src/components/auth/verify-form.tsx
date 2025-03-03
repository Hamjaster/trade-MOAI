import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { resendCode, verifyUserCode } from "@/store/authSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import toast from "react-hot-toast";

export function VerifyForm() {
  const { email } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    const code = otp.join("");
    dispatch(verifyUserCode({ email, code }))
      .unwrap()
      .then((data) => {
        console.log(data);
        navigate("/dashboard");
      })
      .catch((err) => {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      });
  }

  async function handleResendCode() {
    if (!email) return;
    dispatch(resendCode({ email }))
      .unwrap()
      .then((data) => {
        console.log(data);
        toast.success("Verification code resent");
      })
      .catch((err) => {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      });
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="border-none shadow-none">
        <CardContent className="space-y-6 p-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="h-12 w-12 text-center text-lg"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button className="w-full h-12" type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify Email
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="p-0 mt-6">
          <p className="text-sm text-muted-foreground text-center w-full">
            Didn't receive the code?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              disabled={isLoading}
              onClick={handleResendCode}
            >
              Resend
            </Button>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
