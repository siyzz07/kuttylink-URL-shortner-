"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormProps {
  onSubmit: (values: any) => Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name is too short")
        .required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit(values);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Password visibility toggle component
  const PasswordToggle = ({ isVisible, onToggle }: { isVisible: boolean, onToggle: () => void }) => (
    <button 
      type="button" 
      onClick={onToggle}
      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all focus:outline-none"
    >
      {isVisible ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
    </button>
  );

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <Input
        id="name"
        type="text"
        label="Full Name"
        placeholder="Enter your name"
        {...formik.getFieldProps("name")}
        error={formik.errors.name}
        touched={formik.touched.name}
      />
      <Input
        id="email"
        type="email"
        label="Email Address"
        placeholder="name@company.com"
        {...formik.getFieldProps("email")}
        error={formik.errors.email}
        touched={formik.touched.email}
      />
      
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="••••••••"
        {...formik.getFieldProps("password")}
        error={formik.errors.password}
        touched={formik.touched.password}
        rightElement={
          <PasswordToggle 
            isVisible={showPassword} 
            onToggle={() => setShowPassword(!showPassword)} 
          />
        }
      />

      <Input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        label="Confirm Password"
        placeholder="••••••••"
        {...formik.getFieldProps("confirmPassword")}
        error={formik.errors.confirmPassword}
        touched={formik.touched.confirmPassword}
        rightElement={
          <PasswordToggle 
            isVisible={showConfirmPassword} 
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
          />
        }
      />
      
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>
      </div>
    </form>
  );
}
