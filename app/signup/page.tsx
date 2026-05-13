"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupForm } from "@/components/features/auth/SignupForm";
import { registerUser } from "@/services/api";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignupSubmit = async (values: any) => {
    setError(null);
    try {
      await registerUser(values);
      // Redirect to login with a success message in the URL
      router.push("/login?message=Account created successfully. Please sign in.");
    } catch (err: any) {
      console.error("Registration failed", err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-slate-200">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200" role="alert">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {/* Separated Component (SRP) */}
        <SignupForm onSubmit={handleSignupSubmit} />

      </div>
    </div>
  );
}
