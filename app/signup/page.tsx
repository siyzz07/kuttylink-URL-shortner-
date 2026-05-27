"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupForm } from "@/components/features/auth/SignupForm";
import { registerUser, getCurrentUser } from "@/services/api";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const data = await getCurrentUser();
      if (data) {
        router.push("/home");
      }
    };
    checkUser();
  }, [router]);

  const handleSignupSubmit = async (values: any) => {
    try {
      await registerUser(values);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      console.error("Registration failed", err);
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-black justify-center bg-slate-50 p-6">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">KuttyLink<span className="text-indigo-600">.</span></span>
      </Link>

      {/* Simple Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-500 text-sm mt-2">Join us and start shortening your links today</p>
        </div>

        <SignupForm onSubmit={handleSignupSubmit} />

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
            Sign in
          </Link>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="mt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} KuttyLink. All rights reserved.
      </footer>
    </div>
  );
}
