import { SignInForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
