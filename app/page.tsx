"use client";

import React, { useState } from "react";
import Link from "next/link";
import { shortenUrl } from "@/services/api";

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) return;

    setIsLoading(true);
    try {
      const response = await shortenUrl(longUrl);
      setShortUrl(response.shortUrl);
    } catch (error) {
      console.error("Failed to shorten URL", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white border-b border-slate-200">
        <div className="text-2xl font-bold text-indigo-600 tracking-tight">
          KuttyLink.
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-sm shadow-indigo-200"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Short links, big results
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
            A powerful URL shortener that gives you full control over your links.
            Create short links, track clicks, and manage your brand effortlessly.
          </p>

          {/* Action Box */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 text-left relative z-10">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="url" className="sr-only">Long URL</label>
                <input
                  id="url"
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all text-lg"
                  placeholder="Paste your long link here"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !longUrl}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg whitespace-nowrap"
              >
                {isLoading ? "Shortening..." : "Shorten"}
              </button>
            </form>

            {/* Result Area */}
            {shortUrl && (
              <div className="mt-6 p-5 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="text-indigo-900 font-medium truncate text-lg">
                  {shortUrl}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    alert("Copied to clipboard!");
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm shadow-indigo-200"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
