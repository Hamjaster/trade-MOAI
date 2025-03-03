import { SignUpForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Logo />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>
      </div>
      <SignUpForm />
    </div>
  );
}
