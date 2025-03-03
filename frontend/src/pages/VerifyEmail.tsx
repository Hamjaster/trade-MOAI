import { VerifyForm } from "@/components/auth/verify-form";
import { Logo } from "@/components/logo";

export default function VerifyPage() {
  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="w-1/3 mx-auto text-center ">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              We sent you a six-digit code to verify your email address
            </p>
          </div>
          <VerifyForm />
        </div>
      </div>
    </div>
  );
}
