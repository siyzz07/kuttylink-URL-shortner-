"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      if (data) {
        setUser(data.user);
        router.push("/home");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 font-bold text-white text-xl transform transition-transform group-hover:scale-105">K</div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">KuttyLink<span className="text-indigo-600">.</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500">Welcome, {user.email.split('@')[0]}</span>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center space-y-8 py-20">
      
          
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] animate-slide-up">
            Short links, <br />
            <span className="text-indigo-600">Infinite</span> results.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
            KuttyLink is the most professional way to shorten, track, and manage your links. 
            Build your brand's recognition with every click. Simple. Fast. Powerful.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-slide-up [animation-delay:400ms]">
            {!user && (
              <>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                >
                  Create free account
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 rounded-2xl font-bold text-lg transition-all"
                >
                  View Demo
                </Link>
              </>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all hover:translate-y-[-2px]"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} KuttyLink Inc. Built for professional creators.
        </p>
      </footer>
    </div>
  );
}
