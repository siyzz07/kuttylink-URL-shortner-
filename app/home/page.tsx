"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { shortenUrl, getCurrentUser, logoutUser, getUrlHistory } from "@/services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, Link as LinkIcon, Scissors, Copy, CheckCircle, Calendar, ExternalLink, Hash } from "lucide-react";

export default function UserHomePage() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const fetchHistory = async () => {
    const data = await getUrlHistory();
    setHistory(data);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      if (data) {
        setUser(data.user);
        fetchHistory();
      } else {
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) return;

    setIsLoading(true);
    try {
      const response = await shortenUrl(longUrl);
      setShortUrl(response.shortUrl);
      setLongUrl(""); 
      toast.success("URL shortened successfully!");
      fetchHistory(); 
    } catch (error) {
      toast.error("Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-100">K</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">KuttyLink<span className="text-indigo-600">.</span></span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Account</p>
            <p className="text-sm font-bold text-slate-700">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-12 py-12">
        {/* Shorten Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shorten your links</h1>
            <p className="text-slate-500 font-medium text-lg">Fast, reliable, and trackable links for your brand.</p>
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-indigo-100/40 border border-slate-100">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <LinkIcon size={22} />
                </div>
                <input
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="Paste your long link here..."
                  required
                  className="w-full pl-14 pr-6 py-6 bg-transparent rounded-[2rem] text-slate-900 placeholder:text-slate-400 focus:outline-none text-lg font-medium"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !longUrl}
                className="sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Scissors size={20} />
                    Shorten
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* History Table */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Hash size={24} className="text-indigo-500" />
              Your Links
            </h2>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
              {history.length} Links Total
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            {history.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <LinkIcon size={32} />
                </div>
                <p className="text-slate-400 font-medium italic">No links shortened yet. Start by pasting a URL above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Original URL</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Short URL</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Created At</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((link) => (
                      <tr key={link._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="max-w-xs truncate font-medium text-slate-600 group-hover:text-slate-900 transition-colors" title={link.originalUrl}>
                            {link.originalUrl}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-600 font-bold">{link.shortUrl}</span>
                            <button 
                              onClick={() => copyToClipboard(link.shortUrl)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Copy to clipboard"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Calendar size={14} />
                            {new Date(link.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {link.clicks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 mt-auto">
        <p className="text-center text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} KuttyLink. Built with precision for professional sharing.
        </p>
      </footer>
    </div>
  );
}
