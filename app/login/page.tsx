"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await loginUser(values);
        toast.success("Welcome back!");
        router.push("/home");
      } catch (err: any) {
        toast.error(err.message || "Invalid credentials");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 font-bold text-white text-xl">K</div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">KuttyLink<span className="text-indigo-600">.</span></span>
      </Link>

      {/* Simple Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-black">Sign in</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="name@email.com"
            {...formik.getFieldProps("email")}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          
          <div className="space-y-1 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-700 tracking-tight ml-1">Password</label>
              <Link href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="" // Already handled by the div above
              placeholder="••••••••"
              {...formik.getFieldProps("password")}
              error={formik.errors.password}
              touched={formik.touched.password}
              rightElement={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                </button>
              }
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-2">
            Sign in
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-600 font-bold hover:text-indigo-700">
            Sign up
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} KuttyLink. All rights reserved.
      </footer>
    </div>
  );
}
