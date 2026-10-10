
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceTicker from "@/components/PriceTicker";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function UpdateProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (updatedName.length > 100) {
      toast.error("Name must be 100 characters or fewer.");
      return;
    }

    setUpdating(true);

    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(
          error.message || "Failed to update your information."
        );
        return;
      }

      toast.success("Information updated successfully!");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="sr-only">Loading profile...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <CategoryFilter selectedCategory={null} />

      <PriceTicker />

      <section className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
        >
          <ArrowLeft size={17} />
          Back to My Profile
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-semibold text-emerald-700">
              BazarDor Account
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Update Information
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Update the name associated with your account.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                maxLength={100}
                required
                disabled={updating}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={updating || !name.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {updating ? "Updating..." : "Update Information"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

