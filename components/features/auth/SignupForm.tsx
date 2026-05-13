"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SignupFormProps {
  onSubmit: (values: any) => Promise<void>;
}

/**
 * SRP: This component ONLY handles form validation and UI.
 * It delegates the actual API call to the parent via the onSubmit prop (Dependency Inversion).
 */
export function SignupForm({ onSubmit }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Confirm Password is required"),
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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        id="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        {...formik.getFieldProps("name")}
        error={formik.errors.name}
        touched={formik.touched.name}
      />
      <Input
        id="email"
        type="email"
        label="Email Address"
        placeholder="m@example.com"
        {...formik.getFieldProps("email")}
        error={formik.errors.email}
        touched={formik.touched.email}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        {...formik.getFieldProps("password")}
        error={formik.errors.password}
        touched={formik.touched.password}
      />
      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="••••••••"
        {...formik.getFieldProps("confirmPassword")}
        error={formik.errors.confirmPassword}
        touched={formik.touched.confirmPassword}
      />
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>
      </div>
    </form>
  );
}
