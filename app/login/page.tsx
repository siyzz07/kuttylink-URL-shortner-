"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "@/services/api";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check for success message in URL (e.g., from signup)
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await loginUser(values);
        alert("Login successful!");
        // Typically: router.push('/dashboard')
      } catch (err: any) {
        console.error("Login failed", err);
        setError(err.message || "Invalid email or password");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4 relative">
      {/* Brand Logo - Top */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
          KuttyLink.
        </Link>
      </div>

      {/* Standard SaaS Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white border border-slate-200 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 text-sm text-green-800 rounded-lg bg-green-50 border border-green-100" role="alert">
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-100" role="alert">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className={`w-full px-4 py-2.5 bg-white border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500"
              } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1.5 font-medium">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className={`w-full px-4 py-2.5 bg-white border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500"
              } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1.5 font-medium">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
