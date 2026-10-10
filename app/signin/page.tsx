"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceTicker from "@/components/PriceTicker";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<"google" | "github" | null>(null);

  const busy = loading || socialLoading !== null;

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড প্রদান করুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।"
        );
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");
      window.location.assign("/");
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল লগইনে সমস্যা হয়েছে।");
        setSocialLoading(null);
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      toast.error("সোশ্যাল লগইনে সমস্যা হয়েছে।");
      setSocialLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF2EE]">
      <Navbar />

      <CategoryFilter selectedCategory={null} />

      <PriceTicker />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#202923]">সাইন ইন</h1>
            <p className="mt-2 text-xs text-slate-500">
              বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
            </p>
          </div>

          {/* Sign In Card */}
          <div className="rounded-2xl border border-[#E1E7E1] bg-white p-6 shadow-sm">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-[#354139]"
                >
                  ইমেইল
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#E1E8E1] bg-[#FCFDFC] px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-[#354139]"
                >
                  পাসওয়ার্ড
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="w-full rounded-lg border border-[#E1E8E1] bg-[#FCFDFC] px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-[#078B43] py-2.5 text-sm font-medium text-white transition hover:bg-[#067638] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "সাইন ইন"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] text-slate-400">অথবা</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSocialSignIn("google")}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#E1E8E1] px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                Google দিয়ে চালিয়ে যান
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleSocialSignIn("github")}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#E1E8E1] px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {socialLoading === "github" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 fill-current text-slate-800"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
                GitHub দিয়ে চালিয়ে যান
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500">
                অ্যাকাউন্ট নেই?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  সাইন আপ করুন
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 transition hover:text-emerald-700"
            >
              ← হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4EAE4] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-center text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </div>
  );
}