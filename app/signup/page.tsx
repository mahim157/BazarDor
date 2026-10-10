
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceTicker from "@/components/PriceTicker";

type SocialProvider = "google" | "github";

function describeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (error && typeof error === "object") {
    const obj = error as Record<string, unknown>;

    return {
      ...obj,
      properties: Object.getOwnPropertyNames(error),
      message: obj.message,
      status: obj.status,
      statusText: obj.statusText,
      code: obj.code,
    };
  }

  return { error };
}

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  const isBusy = loading || socialLoading !== null;

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isBusy) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail || !password) {
      toast.error("সকল ঘর সঠিকভাবে পূরণ করুন।");
      return;
    }

    if (password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
        callbackURL: "/signin",
      });

      console.log("SIGNUP RESULT:", result);

      if (result.error) {
        console.error(
          "SIGNUP ERROR:",
          describeError(result.error)
        );

        toast.error(
          result.error.message ||
            "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success(
        "অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।"
      );

      router.push("/signin");
    } catch (error) {
      console.error(
        "SIGNUP EXCEPTION:",
        describeError(error)
      );

      toast.error(
        "নিবন্ধন সম্পন্ন হয়নি। সার্ভার ও Network response পরীক্ষা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: SocialProvider
  ) => {
    if (isBusy) return;

    setSocialLoading(provider);

    try {
      console.info(`${provider} sign-in started`);

      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signup",
      });

      console.log(
        `${provider.toUpperCase()} SIGN-IN RESULT:`,
        result
      );

      if (result.error) {
        console.error(
          `${provider.toUpperCase()} SIGN-IN ERROR:`,
          describeError(result.error)
        );

        toast.error(
          result.error.message ||
            `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করা যায়নি।`
        );
        return;
      }

      if (result.data?.url) {
        window.location.assign(result.data.url);
        return;
      }

      console.error(
        `${provider.toUpperCase()} returned no redirect URL`,
        result
      );

      toast.error(
        "OAuth redirect URL পাওয়া যায়নি। Auth configuration পরীক্ষা করুন।"
      );
    } catch (error) {
      console.error(
        `${provider.toUpperCase()} SIGN-IN EXCEPTION:`,
        describeError(error)
      );

      toast.error(
        "সার্ভারের সঙ্গে সংযোগ করা যায়নি। Terminal ও Network পরীক্ষা করুন।"
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5F0] text-slate-800 flex flex-col">
      <Navbar />

      <CategoryFilter selectedCategory={null} />

      <PriceTicker />

      <main className="flex-1 w-full px-4 py-8 sm:py-10 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              অ্যাকাউন্ট তৈরি করুন
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              বিনা খরচে সাইন আপ করে বাজার দর ব্যবহার শুরু করুন।
            </p>
          </div>

          <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <form
              onSubmit={handleRegister}
              className="space-y-3.5"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  নাম
                </label>

                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মইনুল মাহিম"
                    disabled={isBusy}
                    className="w-full h-10 bg-[#F8FAF8] border border-slate-200 rounded-lg pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  ইমেইল
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isBusy}
                    className="w-full h-10 bg-[#F8FAF8] border border-slate-200 rounded-lg pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  পাসওয়ার্ড
                </label>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="কমপক্ষে ৮ অক্ষর"
                    disabled={isBusy}
                    className="w-full h-10 bg-[#F8FAF8] border border-slate-200 rounded-lg pl-10 pr-11 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "পাসওয়ার্ড লুকান"
                        : "পাসওয়ার্ড দেখান"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="w-full h-11 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}

                {loading
                  ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                  : "অ্যাকাউন্ট তৈরি করুন"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">
                অথবা
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={isBusy}
                className="min-h-10 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
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

                {socialLoading === "google"
                  ? "Google-এ সংযোগ হচ্ছে..."
                  : "Google দিয়ে সাইন আপ"}
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                disabled={isBusy}
                className="min-h-10 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === "github" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 fill-slate-900 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3 1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}

                {socialLoading === "github"
                  ? "GitHub-এ সংযোগ হচ্ছে..."
                  : "GitHub দিয়ে সাইন আপ"}
              </button>
            </div>

            <div className="border-t border-slate-100 mt-5 pt-4 text-center">
              <p className="text-xs sm:text-sm text-slate-500">
                আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                <Link
                  href="/signin"
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  লগইন করুন
                </Link>
              </p>
            </div>
          </section>

          <p className="text-center text-xs text-slate-400 mt-5">
            ←{" "}
            <Link href="/" className="hover:text-emerald-600">
              বাজার দর হোম পেজে ফিরে যান
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center">
          <span>
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </span>
          <span>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </span>
        </div>
      </footer>
    </div>
  );
}