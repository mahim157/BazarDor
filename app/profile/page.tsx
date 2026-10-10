"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceTicker from "@/components/PriceTicker";
import {
  UserRound,
  Mail,
  Pencil,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "Sign out failed."
        );
        return;
      }

      toast.success("Signed out successfully!");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </main>
    );
  }

  const user = session.user;
  const displayName = user.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <CategoryFilter selectedCategory={null} />

      <PriceTicker />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-700">
            BazarDor Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your account information and settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Profile summary */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-4xl font-bold text-emerald-700">
                {initial}
              </div>

              <h2 className="mt-4 break-words text-xl font-semibold">
                {displayName}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </p>

              <span className="mt-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active Account
              </span>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <Link
                href="/"
                className="block rounded-lg px-4 py-3 text-center text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                ← Back to Home
              </Link>
            </div>
          </aside>

          {/* Personal information */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View and update your account details.
                  </p>
                </div>

                {/* Edit বাটনটি এখন লিংক হিসেবে অন্য রাউটে নিয়ে যাবে */}
                <Link
                  href="/profile/update"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
                >
                  <Pencil size={15} />
                  Edit
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                    <UserRound size={16} />
                    Full Name
                  </label>

                  <div className="rounded-xl bg-gray-50 px-4 py-3 font-medium">
                    {displayName}
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Mail size={16} />
                    Email Address
                  </label>

                  <div className="break-all rounded-xl bg-gray-50 px-4 py-3 text-gray-600">
                    {user.email}
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Your email address is managed by your login provider.
                  </p>
                </div>
              </div>
            </section>

            {/* Sign out */}
            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">
                Account Actions
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign out of your BazarDor account on this device.
              </p>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingOut ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut size={17} />
                )}

                {signingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </section>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BazarDor. All rights reserved.
        </p>
      </section>
    </main>
  );
}